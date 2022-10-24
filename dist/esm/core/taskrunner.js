function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

export var TaskRunner = /*#__PURE__*/function () {
  function TaskRunner() {
    _classCallCheck(this, TaskRunner);

    this.count = null;
    this.current = null;
    this.callbacks = null;
  }

  _createClass(TaskRunner, [{
    key: "Run",
    value: function Run(count, callbacks) {
      this.count = count;
      this.current = 0;
      this.callbacks = callbacks;

      if (count === 0) {
        this.TaskReady();
      } else {
        this.RunOnce();
      }
    }
  }, {
    key: "RunBatch",
    value: function RunBatch(count, batchCount, callbacks) {
      var stepCount = 0;

      if (count > 0) {
        stepCount = parseInt((count - 1) / batchCount, 10) + 1;
      }

      this.Run(stepCount, {
        runTask: function runTask(index, ready) {
          var firstIndex = index * batchCount;
          var lastIndex = Math.min((index + 1) * batchCount, count) - 1;
          callbacks.runTask(firstIndex, lastIndex, ready);
        },
        onReady: callbacks.onReady
      });
    }
  }, {
    key: "RunOnce",
    value: function RunOnce() {
      var _this = this;

      setTimeout(function () {
        _this.callbacks.runTask(_this.current, _this.TaskReady.bind(_this));
      }, 0);
    }
  }, {
    key: "TaskReady",
    value: function TaskReady() {
      this.current += 1;

      if (this.current < this.count) {
        this.RunOnce();
      } else {
        if (this.callbacks.onReady) {
          this.callbacks.onReady();
        }
      }
    }
  }]);

  return TaskRunner;
}();
export function RunTaskAsync(task) {
  setTimeout(function () {
    task();
  }, 10);
}
export function RunTasks(count, callbacks) {
  var taskRunner = new TaskRunner();
  taskRunner.Run(count, callbacks);
}
export function RunTasksBatch(count, batchCount, callbacks) {
  var taskRunner = new TaskRunner();
  taskRunner.RunBatch(count, batchCount, callbacks);
}
export function WaitWhile(expression) {
  function Waiter(expression) {
    if (expression()) {
      setTimeout(function () {
        Waiter(expression);
      }, 10);
    }
  }

  Waiter(expression);
}