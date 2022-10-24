function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

export var TopologyVertex = /*#__PURE__*/_createClass(function TopologyVertex() {
  _classCallCheck(this, TopologyVertex);

  this.edges = [];
  this.triangles = [];
});
export var TopologyEdge = /*#__PURE__*/_createClass(function TopologyEdge(vertex1, vertex2) {
  _classCallCheck(this, TopologyEdge);

  this.vertex1 = vertex1;
  this.vertex2 = vertex2;
  this.triangles = [];
});
export var TopologyTriangleEdge = /*#__PURE__*/_createClass(function TopologyTriangleEdge(edge, reversed) {
  _classCallCheck(this, TopologyTriangleEdge);

  this.edge = edge;
  this.reversed = reversed;
});
export var TopologyTriangle = /*#__PURE__*/_createClass(function TopologyTriangle() {
  _classCallCheck(this, TopologyTriangle);

  this.triEdge1 = null;
  this.triEdge2 = null;
  this.triEdge3 = null;
});
export var Topology = /*#__PURE__*/function () {
  function Topology() {
    _classCallCheck(this, Topology);

    this.vertices = [];
    this.edges = [];
    this.triangleEdges = [];
    this.triangles = [];
    this.edgeStartToEndVertexMap = new Map();
  }

  _createClass(Topology, [{
    key: "AddVertex",
    value: function AddVertex() {
      this.vertices.push(new TopologyVertex());
      return this.vertices.length - 1;
    }
  }, {
    key: "AddTriangle",
    value: function AddTriangle(vertex1, vertex2, vertex3) {
      function AddTriangleToVertex(vertices, vertexIndex, triangleIndex) {
        var vertex = vertices[vertexIndex];
        vertex.triangles.push(triangleIndex);
      }

      function AddEdgeToVertex(vertices, triangleEdges, vertexIndex, triangleEdgeIndex) {
        var vertex = vertices[vertexIndex];
        var triangleEdge = triangleEdges[triangleEdgeIndex];
        vertex.edges.push(triangleEdge.edge);
      }

      function AddTriangleToEdge(edges, triangleEdges, triangleEdgeIndex, triangleIndex) {
        var triangleEdge = triangleEdges[triangleEdgeIndex];
        var edge = edges[triangleEdge.edge];
        edge.triangles.push(triangleIndex);
      }

      var triangleIndex = this.triangles.length;
      var triangle = new TopologyTriangle();
      triangle.triEdge1 = this.AddTriangleEdge(vertex1, vertex2);
      triangle.triEdge2 = this.AddTriangleEdge(vertex2, vertex3);
      triangle.triEdge3 = this.AddTriangleEdge(vertex3, vertex1);
      AddTriangleToVertex(this.vertices, vertex1, triangleIndex);
      AddTriangleToVertex(this.vertices, vertex2, triangleIndex);
      AddTriangleToVertex(this.vertices, vertex3, triangleIndex);
      AddEdgeToVertex(this.vertices, this.triangleEdges, vertex1, triangle.triEdge1);
      AddEdgeToVertex(this.vertices, this.triangleEdges, vertex2, triangle.triEdge2);
      AddEdgeToVertex(this.vertices, this.triangleEdges, vertex3, triangle.triEdge3);
      AddTriangleToEdge(this.edges, this.triangleEdges, triangle.triEdge1, triangleIndex);
      AddTriangleToEdge(this.edges, this.triangleEdges, triangle.triEdge2, triangleIndex);
      AddTriangleToEdge(this.edges, this.triangleEdges, triangle.triEdge3, triangleIndex);
      this.triangles.push(triangle);
    }
  }, {
    key: "AddTriangleEdge",
    value: function AddTriangleEdge(vertex1, vertex2) {
      var startVertex = vertex1;
      var endVertex = vertex2;
      var reversed = false;

      if (vertex2 < vertex1) {
        startVertex = vertex2;
        endVertex = vertex1;
        reversed = true;
      }

      var edgeIndex = this.AddEdge(startVertex, endVertex);
      this.triangleEdges.push(new TopologyTriangleEdge(edgeIndex, reversed));
      return this.triangleEdges.length - 1;
    }
  }, {
    key: "AddEdge",
    value: function AddEdge(startVertex, endVertex) {
      if (!this.edgeStartToEndVertexMap.has(startVertex)) {
        this.edgeStartToEndVertexMap.set(startVertex, []);
      }

      var endVertices = this.edgeStartToEndVertexMap.get(startVertex);

      for (var i = 0; i < endVertices.length; i++) {
        var endVertexItem = endVertices[i];

        if (endVertexItem.endVertex === endVertex) {
          return endVertexItem.edgeIndex;
        }
      }

      var edgeIndex = this.edges.length;
      endVertices.push({
        endVertex: endVertex,
        edgeIndex: edgeIndex
      });
      this.edges.push(new TopologyEdge(startVertex, endVertex));
      return edgeIndex;
    }
  }]);

  return Topology;
}();