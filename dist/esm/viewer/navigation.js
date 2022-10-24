function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import { Coord2D, CoordDistance2D, SubCoord2D } from "../geometry/coord2d.js";
import { CoordDistance3D, CrossVector3D, SubCoord3D, VectorAngle3D } from "../geometry/coord3d.js";
import { DegRad, IsGreater, IsLower, IsZero } from "../geometry/geometry.js";
import { ParabolicTweenFunction, TweenCoord3D } from "../geometry/tween.js";
import { CameraIsEqual3D } from "./camera.js";
import { GetDomElementClientCoordinates } from "./domutils.js";
export var MouseInteraction = /*#__PURE__*/function () {
  function MouseInteraction() {
    _classCallCheck(this, MouseInteraction);

    this.prev = new Coord2D(0.0, 0.0);
    this.curr = new Coord2D(0.0, 0.0);
    this.diff = new Coord2D(0.0, 0.0);
    this.buttons = [];
  }

  _createClass(MouseInteraction, [{
    key: "Down",
    value: function Down(canvas, ev) {
      this.buttons.push(ev.which);
      this.curr = this.GetPositionFromEvent(canvas, ev);
      this.prev = this.curr.Clone();
    }
  }, {
    key: "Move",
    value: function Move(canvas, ev) {
      this.curr = this.GetPositionFromEvent(canvas, ev);
      this.diff = SubCoord2D(this.curr, this.prev);
      this.prev = this.curr.Clone();
    }
  }, {
    key: "Up",
    value: function Up(canvas, ev) {
      var buttonIndex = this.buttons.indexOf(ev.which);

      if (buttonIndex !== -1) {
        this.buttons.splice(buttonIndex, 1);
      }

      this.curr = this.GetPositionFromEvent(canvas, ev);
    }
  }, {
    key: "Leave",
    value: function Leave(canvas, ev) {
      this.buttons = [];
      this.curr = this.GetPositionFromEvent(canvas, ev);
    }
  }, {
    key: "IsButtonDown",
    value: function IsButtonDown() {
      return this.buttons.length > 0;
    }
  }, {
    key: "GetButton",
    value: function GetButton() {
      var length = this.buttons.length;

      if (length === 0) {
        return 0;
      }

      return this.buttons[length - 1];
    }
  }, {
    key: "GetPosition",
    value: function GetPosition() {
      return this.curr;
    }
  }, {
    key: "GetMoveDiff",
    value: function GetMoveDiff() {
      return this.diff;
    }
  }, {
    key: "GetPositionFromEvent",
    value: function GetPositionFromEvent(canvas, ev) {
      return GetDomElementClientCoordinates(canvas, ev.clientX, ev.clientY);
    }
  }]);

  return MouseInteraction;
}();
export var TouchInteraction = /*#__PURE__*/function () {
  function TouchInteraction() {
    _classCallCheck(this, TouchInteraction);

    this.prevPos = new Coord2D(0.0, 0.0);
    this.currPos = new Coord2D(0.0, 0.0);
    this.diffPos = new Coord2D(0.0, 0.0);
    this.prevDist = 0.0;
    this.currDist = 0.0;
    this.diffDist = 0.0;
    this.fingers = 0;
  }

  _createClass(TouchInteraction, [{
    key: "Start",
    value: function Start(canvas, ev) {
      if (ev.touches.length === 0) {
        return;
      }

      this.fingers = ev.touches.length;
      this.currPos = this.GetPositionFromEvent(canvas, ev);
      this.prevPos = this.currPos.Clone();
      this.currDist = this.GetTouchDistanceFromEvent(canvas, ev);
      this.prevDist = this.currDist;
    }
  }, {
    key: "Move",
    value: function Move(canvas, ev) {
      if (ev.touches.length === 0) {
        return;
      }

      this.currPos = this.GetPositionFromEvent(canvas, ev);
      this.diffPos = SubCoord2D(this.currPos, this.prevPos);
      this.prevPos = this.currPos.Clone();
      this.currDist = this.GetTouchDistanceFromEvent(canvas, ev);
      this.diffDist = this.currDist - this.prevDist;
      this.prevDist = this.currDist;
    }
  }, {
    key: "End",
    value: function End(canvas, ev) {
      if (ev.touches.length === 0) {
        return;
      }

      this.fingers = 0;
      this.currPos = this.GetPositionFromEvent(canvas, ev);
      this.currDist = this.GetTouchDistanceFromEvent(canvas, ev);
    }
  }, {
    key: "IsFingerDown",
    value: function IsFingerDown() {
      return this.fingers !== 0;
    }
  }, {
    key: "GetFingerCount",
    value: function GetFingerCount() {
      return this.fingers;
    }
  }, {
    key: "GetPosition",
    value: function GetPosition() {
      return this.currPos;
    }
  }, {
    key: "GetMoveDiff",
    value: function GetMoveDiff() {
      return this.diffPos;
    }
  }, {
    key: "GetDistanceDiff",
    value: function GetDistanceDiff() {
      return this.diffDist;
    }
  }, {
    key: "GetPositionFromEvent",
    value: function GetPositionFromEvent(canvas, ev) {
      var coord = null;

      if (ev.touches.length !== 0) {
        var touchEv = ev.touches[0];
        coord = GetDomElementClientCoordinates(canvas, touchEv.pageX, touchEv.pageY);
      }

      return coord;
    }
  }, {
    key: "GetTouchDistanceFromEvent",
    value: function GetTouchDistanceFromEvent(canvas, ev) {
      if (ev.touches.length !== 2) {
        return 0.0;
      }

      var touchEv1 = ev.touches[0];
      var touchEv2 = ev.touches[1];
      var distance = CoordDistance2D(GetDomElementClientCoordinates(canvas, touchEv1.pageX, touchEv1.pageY), GetDomElementClientCoordinates(canvas, touchEv2.pageX, touchEv2.pageY));
      return distance;
    }
  }]);

  return TouchInteraction;
}();
export var ClickDetector = /*#__PURE__*/function () {
  function ClickDetector() {
    _classCallCheck(this, ClickDetector);

    this.isClick = false;
    this.startPosition = null;
  }

  _createClass(ClickDetector, [{
    key: "Start",
    value: function Start(startPosition) {
      this.isClick = true;
      this.startPosition = startPosition;
    }
  }, {
    key: "Move",
    value: function Move(currentPosition) {
      if (!this.isClick) {
        return;
      }

      if (this.startPosition !== null) {
        var maxClickDistance = 3.0;
        var currentDistance = CoordDistance2D(this.startPosition, currentPosition);

        if (currentDistance > maxClickDistance) {
          this.Cancel();
        }
      } else {
        this.Cancel();
      }
    }
  }, {
    key: "End",
    value: function End() {
      this.startPosition = null;
    }
  }, {
    key: "Cancel",
    value: function Cancel() {
      this.isClick = false;
      this.startPosition = null;
    }
  }, {
    key: "IsClick",
    value: function IsClick() {
      return this.isClick;
    }
  }]);

  return ClickDetector;
}();
export var NavigationType = {
  None: 0,
  Orbit: 1,
  Pan: 2,
  Zoom: 3
};
export var Navigation = /*#__PURE__*/function () {
  function Navigation(canvas, camera, callbacks) {
    _classCallCheck(this, Navigation);

    this.canvas = canvas;
    this.camera = camera;
    this.callbacks = callbacks;
    this.fixUpVector = true;
    this.mouse = new MouseInteraction();
    this.touch = new TouchInteraction();
    this.clickDetector = new ClickDetector();
    this.onMouseClick = null;
    this.onMouseMove = null;
    this.onContext = null;

    if (this.canvas.addEventListener) {
      this.canvas.addEventListener('mousedown', this.OnMouseDown.bind(this));
      this.canvas.addEventListener('wheel', this.OnMouseWheel.bind(this));
      this.canvas.addEventListener('touchstart', this.OnTouchStart.bind(this));
      this.canvas.addEventListener('touchmove', this.OnTouchMove.bind(this));
      this.canvas.addEventListener('touchcancel', this.OnTouchEnd.bind(this));
      this.canvas.addEventListener('touchend', this.OnTouchEnd.bind(this));
      this.canvas.addEventListener('contextmenu', this.OnContextMenu.bind(this));
    }

    if (document.addEventListener) {
      document.addEventListener('mousemove', this.OnMouseMove.bind(this));
      document.addEventListener('mouseup', this.OnMouseUp.bind(this));
      document.addEventListener('mouseleave', this.OnMouseLeave.bind(this));
    }
  }

  _createClass(Navigation, [{
    key: "SetMouseClickHandler",
    value: function SetMouseClickHandler(onMouseClick) {
      this.onMouseClick = onMouseClick;
    }
  }, {
    key: "SetMouseMoveHandler",
    value: function SetMouseMoveHandler(onMouseMove) {
      this.onMouseMove = onMouseMove;
    }
  }, {
    key: "SetContextMenuHandler",
    value: function SetContextMenuHandler(onContext) {
      this.onContext = onContext;
    }
  }, {
    key: "IsFixUpVector",
    value: function IsFixUpVector() {
      return this.fixUpVector;
    }
  }, {
    key: "SetFixUpVector",
    value: function SetFixUpVector(fixUpVector) {
      this.fixUpVector = fixUpVector;
    }
  }, {
    key: "GetCamera",
    value: function GetCamera() {
      return this.camera;
    }
  }, {
    key: "SetCamera",
    value: function SetCamera(camera) {
      this.camera = camera;
    }
  }, {
    key: "MoveCamera",
    value: function MoveCamera(newCamera, stepCount) {
      var _this = this;

      function Step(obj, steps, count, index) {
        obj.camera.eye = steps.eye[index];
        obj.camera.center = steps.center[index];
        obj.camera.up = steps.up[index];
        obj.Update();

        if (index < count - 1) {
          requestAnimationFrame(function () {
            Step(obj, steps, count, index + 1);
          });
        }
      }

      if (newCamera === null) {
        return;
      }

      if (stepCount === 0 || CameraIsEqual3D(this.camera, newCamera)) {
        this.camera = newCamera;
      } else {
        var tweenFunc = ParabolicTweenFunction;
        var steps = {
          eye: TweenCoord3D(this.camera.eye, newCamera.eye, stepCount, tweenFunc),
          center: TweenCoord3D(this.camera.center, newCamera.center, stepCount, tweenFunc),
          up: TweenCoord3D(this.camera.up, newCamera.up, stepCount, tweenFunc)
        };
        requestAnimationFrame(function () {
          Step(_this, steps, stepCount, 0);
        });
      }

      this.Update();
    }
  }, {
    key: "GetFitToSphereCamera",
    value: function GetFitToSphereCamera(center, radius) {
      if (IsZero(radius)) {
        return null;
      }

      var fitCamera = this.camera.Clone();
      var offsetToOrigo = SubCoord3D(fitCamera.center, center);
      fitCamera.eye = SubCoord3D(fitCamera.eye, offsetToOrigo);
      fitCamera.center = center.Clone();
      var centerEyeDirection = SubCoord3D(fitCamera.eye, fitCamera.center).Normalize();
      var fieldOfView = this.camera.fov / 2.0;

      if (this.canvas.width < this.canvas.height) {
        fieldOfView = fieldOfView * this.canvas.width / this.canvas.height;
      }

      var distance = radius / Math.sin(fieldOfView * DegRad);
      fitCamera.eye = fitCamera.center.Clone().Offset(centerEyeDirection, distance);
      return fitCamera;
    }
  }, {
    key: "OnMouseDown",
    value: function OnMouseDown(ev) {
      ev.preventDefault();
      this.mouse.Down(this.canvas, ev);
      this.clickDetector.Start(this.mouse.GetPosition());
    }
  }, {
    key: "OnMouseMove",
    value: function OnMouseMove(ev) {
      this.mouse.Move(this.canvas, ev);
      this.clickDetector.Move(this.mouse.GetPosition());

      if (this.onMouseMove) {
        var mouseCoords = GetDomElementClientCoordinates(this.canvas, ev.clientX, ev.clientY);
        this.onMouseMove(mouseCoords);
      }

      if (!this.mouse.IsButtonDown()) {
        return;
      }

      var moveDiff = this.mouse.GetMoveDiff();
      var mouseButton = this.mouse.GetButton();
      var navigationType = NavigationType.None;

      if (mouseButton === 1) {
        if (ev.ctrlKey) {
          navigationType = NavigationType.Zoom;
        } else if (ev.shiftKey) {
          navigationType = NavigationType.Pan;
        } else {
          navigationType = NavigationType.Orbit;
        }
      } else if (mouseButton === 2 || mouseButton === 3) {
        navigationType = NavigationType.Pan;
      }

      if (navigationType === NavigationType.Orbit) {
        var orbitRatio = 0.5;
        this.Orbit(moveDiff.x * orbitRatio, moveDiff.y * orbitRatio);
      } else if (navigationType === NavigationType.Pan) {
        var eyeCenterDistance = CoordDistance3D(this.camera.eye, this.camera.center);
        var panRatio = 0.001 * eyeCenterDistance;
        this.Pan(moveDiff.x * panRatio, moveDiff.y * panRatio);
      } else if (navigationType === NavigationType.Zoom) {
        var zoomRatio = 0.005;
        this.Zoom(-moveDiff.y * zoomRatio);
      }

      this.Update();
    }
  }, {
    key: "OnMouseUp",
    value: function OnMouseUp(ev) {
      this.mouse.Up(this.canvas, ev);
      this.clickDetector.End();

      if (this.clickDetector.IsClick()) {
        var mouseCoords = this.mouse.GetPosition();
        this.Click(ev.which, mouseCoords);
      }
    }
  }, {
    key: "OnMouseLeave",
    value: function OnMouseLeave(ev) {
      this.mouse.Leave(this.canvas, ev);
      this.clickDetector.Cancel();
    }
  }, {
    key: "OnTouchStart",
    value: function OnTouchStart(ev) {
      ev.preventDefault();
      this.touch.Start(this.canvas, ev);
      this.clickDetector.Start(this.touch.GetPosition());
    }
  }, {
    key: "OnTouchMove",
    value: function OnTouchMove(ev) {
      ev.preventDefault();
      this.touch.Move(this.canvas, ev);
      this.clickDetector.Move(this.touch.GetPosition());

      if (!this.touch.IsFingerDown()) {
        return;
      }

      var moveDiff = this.touch.GetMoveDiff();
      var distanceDiff = this.touch.GetDistanceDiff();
      var fingerCount = this.touch.GetFingerCount();
      var navigationType = NavigationType.None;

      if (fingerCount === 1) {
        navigationType = NavigationType.Orbit;
      } else if (fingerCount === 2) {
        navigationType = NavigationType.Pan;
      }

      if (navigationType === NavigationType.Orbit) {
        var orbitRatio = 0.5;
        this.Orbit(moveDiff.x * orbitRatio, moveDiff.y * orbitRatio);
      } else if (navigationType === NavigationType.Pan) {
        var zoomRatio = 0.005;
        this.Zoom(distanceDiff * zoomRatio);
        var panRatio = 0.001 * CoordDistance3D(this.camera.eye, this.camera.center);
        this.Pan(moveDiff.x * panRatio, moveDiff.y * panRatio);
      }

      this.Update();
    }
  }, {
    key: "OnTouchEnd",
    value: function OnTouchEnd(ev) {
      ev.preventDefault();
      this.touch.End(this.canvas, ev);
      this.clickDetector.End();

      if (this.clickDetector.IsClick()) {
        var touchCoords = this.touch.GetPosition();

        if (this.touch.GetFingerCount() === 1) {
          this.Click(1, touchCoords);
        }
      }
    }
  }, {
    key: "OnMouseWheel",
    value: function OnMouseWheel(ev) {
      var params = ev || window.event;
      params.preventDefault();
      var delta = -params.deltaY / 40;
      var ratio = 0.1;

      if (delta < 0) {
        ratio = ratio * -1.0;
      }

      this.Zoom(ratio);
      this.Update();
    }
  }, {
    key: "OnContextMenu",
    value: function OnContextMenu(ev) {
      ev.preventDefault();

      if (this.clickDetector.IsClick()) {
        this.Context(ev.clientX, ev.clientY);
        this.clickDetector.Cancel();
      }
    }
  }, {
    key: "Orbit",
    value: function Orbit(angleX, angleY) {
      var radAngleX = angleX * DegRad;
      var radAngleY = angleY * DegRad;
      var viewDirection = SubCoord3D(this.camera.center, this.camera.eye).Normalize();
      var horizontalDirection = CrossVector3D(viewDirection, this.camera.up).Normalize();

      if (this.fixUpVector) {
        var originalAngle = VectorAngle3D(viewDirection, this.camera.up);
        var newAngle = originalAngle + radAngleY;

        if (IsGreater(newAngle, 0.0) && IsLower(newAngle, Math.PI)) {
          this.camera.eye.Rotate(horizontalDirection, -radAngleY, this.camera.center);
        }

        this.camera.eye.Rotate(this.camera.up, -radAngleX, this.camera.center);
      } else {
        var verticalDirection = CrossVector3D(horizontalDirection, viewDirection).Normalize();
        this.camera.eye.Rotate(horizontalDirection, -radAngleY, this.camera.center);
        this.camera.eye.Rotate(verticalDirection, -radAngleX, this.camera.center);
        this.camera.up = verticalDirection;
      }
    }
  }, {
    key: "Pan",
    value: function Pan(moveX, moveY) {
      var viewDirection = SubCoord3D(this.camera.center, this.camera.eye).Normalize();
      var horizontalDirection = CrossVector3D(viewDirection, this.camera.up).Normalize();
      var verticalDirection = CrossVector3D(horizontalDirection, viewDirection).Normalize();
      this.camera.eye.Offset(horizontalDirection, -moveX);
      this.camera.center.Offset(horizontalDirection, -moveX);
      this.camera.eye.Offset(verticalDirection, moveY);
      this.camera.center.Offset(verticalDirection, moveY);
    }
  }, {
    key: "Zoom",
    value: function Zoom(ratio) {
      var direction = SubCoord3D(this.camera.center, this.camera.eye);
      var distance = direction.Length();
      var move = distance * ratio;
      this.camera.eye.Offset(direction, move);
    }
  }, {
    key: "Update",
    value: function Update() {
      this.callbacks.onUpdate();
    }
  }, {
    key: "Click",
    value: function Click(button, mouseCoords) {
      if (this.onMouseClick) {
        this.onMouseClick(button, mouseCoords);
      }
    }
  }, {
    key: "Context",
    value: function Context(clientX, clientY) {
      if (this.onContext) {
        var globalCoords = {
          x: clientX,
          y: clientY
        };
        var localCoords = GetDomElementClientCoordinates(this.canvas, clientX, clientY);
        this.onContext(globalCoords, localCoords);
      }
    }
  }]);

  return Navigation;
}();