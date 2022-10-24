function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Box3D } from "./box3d.js";
import { Coord3D, CoordIsEqual3D } from "./coord3d.js";
import { IsGreaterOrEqual, IsLowerOrEqual } from "./geometry.js";
export var OctreeNode = /*#__PURE__*/function () {
  function OctreeNode(boundingBox, level) {
    _classCallCheck(this, OctreeNode);

    this.boundingBox = boundingBox;
    this.level = level;
    this.pointItems = [];
    this.childNodes = [];
  }

  _createClass(OctreeNode, [{
    key: "AddPoint",
    value: function AddPoint(point, data, options) {
      var node = this.FindNodeForPoint(point);

      if (node === null) {
        return false;
      }

      if (node.FindPointDirectly(point) !== null) {
        return false;
      }

      if (node.pointItems.length < options.maxPointsPerNode || node.level >= options.maxTreeDepth) {
        node.AddPointDirectly(point, data);
        return true;
      } else {
        node.CreateChildNodes();
        var oldPointItems = node.pointItems;
        node.pointItems = [];

        for (var i = 0; i < oldPointItems.length; i++) {
          var pointItem = oldPointItems[i];

          if (!node.AddPoint(pointItem.point, pointItem.data, options)) {
            return false;
          }
        }

        return node.AddPoint(point, data, options);
      }
    }
  }, {
    key: "FindPoint",
    value: function FindPoint(point) {
      var node = this.FindNodeForPoint(point);

      if (node === null) {
        return null;
      }

      return node.FindPointDirectly(point);
    }
  }, {
    key: "AddPointDirectly",
    value: function AddPointDirectly(point, data) {
      this.pointItems.push({
        point: point,
        data: data
      });
    }
  }, {
    key: "FindPointDirectly",
    value: function FindPointDirectly(point) {
      for (var i = 0; i < this.pointItems.length; i++) {
        var pointItem = this.pointItems[i];

        if (CoordIsEqual3D(point, pointItem.point)) {
          return pointItem.data;
        }
      }

      return null;
    }
  }, {
    key: "FindNodeForPoint",
    value: function FindNodeForPoint(point) {
      if (!this.IsPointInBounds(point)) {
        return null;
      }

      if (this.childNodes.length === 0) {
        return this;
      }

      for (var i = 0; i < this.childNodes.length; i++) {
        var childNode = this.childNodes[i];
        var foundNode = childNode.FindNodeForPoint(point);

        if (foundNode !== null) {
          return foundNode;
        }
      }

      return null;
    }
  }, {
    key: "CreateChildNodes",
    value: function CreateChildNodes() {
      function AddChildNode(node, minX, minY, minZ, sizeX, sizeY, sizeZ) {
        var box = new Box3D(new Coord3D(minX, minY, minZ), new Coord3D(minX + sizeX, minY + sizeY, minZ + sizeZ));
        node.childNodes.push(new OctreeNode(box, node.level + 1));
      }

      var min = this.boundingBox.min;
      var center = this.boundingBox.GetCenter();
      var sizeX = (this.boundingBox.max.x - this.boundingBox.min.x) / 2.0;
      var sizeY = (this.boundingBox.max.y - this.boundingBox.min.y) / 2.0;
      var sizeZ = (this.boundingBox.max.z - this.boundingBox.min.z) / 2.0;
      AddChildNode(this, min.x, min.y, min.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, center.x, min.y, min.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, min.x, center.y, min.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, center.x, center.y, min.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, min.x, min.y, center.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, center.x, min.y, center.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, min.x, center.y, center.z, sizeX, sizeY, sizeZ);
      AddChildNode(this, center.x, center.y, center.z, sizeX, sizeY, sizeZ);
    }
  }, {
    key: "IsPointInBounds",
    value: function IsPointInBounds(point) {
      var isEqual = IsGreaterOrEqual(point.x, this.boundingBox.min.x) && IsGreaterOrEqual(point.y, this.boundingBox.min.y) && IsGreaterOrEqual(point.z, this.boundingBox.min.z) && IsLowerOrEqual(point.x, this.boundingBox.max.x) && IsLowerOrEqual(point.y, this.boundingBox.max.y) && IsLowerOrEqual(point.z, this.boundingBox.max.z);
      return isEqual;
    }
  }]);

  return OctreeNode;
}();
export var Octree = /*#__PURE__*/function () {
  function Octree(boundingBox, options) {
    _classCallCheck(this, Octree);

    this.options = {
      maxPointsPerNode: 10,
      maxTreeDepth: 10
    };

    if (options !== undefined) {
      if (options.maxPointsPerNode !== undefined) {
        this.options.maxPointsPerNode = options.maxPointsPerNode;
      }

      if (options.maxTreeDepth !== undefined) {
        this.options.maxTreeDepth = options.maxTreeDepth;
      }
    }

    this.rootNode = new OctreeNode(boundingBox, 0);
  }

  _createClass(Octree, [{
    key: "AddPoint",
    value: function AddPoint(point, data) {
      return this.rootNode.AddPoint(point, data, this.options);
    }
  }, {
    key: "FindPoint",
    value: function FindPoint(point) {
      return this.rootNode.FindPoint(point);
    }
  }]);

  return Octree;
}();