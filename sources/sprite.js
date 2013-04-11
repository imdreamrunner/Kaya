/*
 * Class Sprite.
 */

Kaya.Sprite = Kaya.Object.extend({
  constructor: function(properties) {
    this.set(properties);

    this.on('refresh', this.refresh);
    this.on('render', this.renderWrapper);
    this.on('touchEvent', this.touchEventHandler);
  },

  run: function(parent) {
    this.parent = parent;
    this.app = parent.app;
    this.context = parent.context;
    if (this.initialize) {
      this.initialize.call(this);
    }
    this.renderWrapper();
  },

  // Default render function, which is empty.
  render: function() {},

  renderWrapper: function(event, render) {
    // Save the context drawing center.
    this.context.save();
    // Move the drawing center.
    this.context.translate(this.get('x'), this.get('y'));
    if (render) {
      render.call(this);
    } else {
      this.render();
    }
    this.context.restore();
  },

  touchEventHandler: function(event, touch) {
    if (this.isTouched(touch)) {
      touch['offsetX'] = touch.x - this.get('x');
      touch['offsetY'] = touch.y - this.get('y');
      this.trigger('touch', touch);
      return true;
    } else {
      return false;
    }
  },

  isTouched: function(touch) {
    return false;
  },

  // Will be called by its parent at fps.
  refresh: function(event, fps) {
    if (this._schedules) {
      this._schedules.forEach(function(schedule) {
        schedule.refresh(fps);
      }, this);
    }
    if (this._actions) {
      this._actions.forEach(function(action) {
        action.refresh(fps);
      }, this);
    }
  },

  // Run an action immediately.
  // Multiple actions can be run at the same time.
  runAction: function(action, callback) {
    this._actions = this._actions || [];
    this._actions.push(action);
    callback ? action.run(this, callback) : action.run(this);
    return this;
  },

  // Remove an action from action list.
  // Will be call by Action when it finished.
  finishAction: function(action) {
    var index = this._actions.indexOf(action);
    if (index > -1) {
      this._actions.splice(index, 1);
    } else {
      throw new Error('Unable to remove finished action.');
    }
  },

  // Add and action to action queue.
  enqueueAction: function(action) {
    this._actionQueue = this._actionQueue || [];
    this._actionQueue.push(action);
    if (!this._queueing) {
      this._runQueueAction();
    }
    return this;
  },

  _runQueueAction: function() {
    if (this._actionQueue && this._actionQueue.length > 0) {
      this._queueing = true;
      this.runAction(this._actionQueue.shift(), this._runQueueAction);
    } else {
      this._queueing = false;
    }
  },

  remove: function() {
    if (this.parent) {
      this.parent.detach(this);
    }
    this.off();
    this.stopListening();
  }
});

Kaya.Utilities.extend(Kaya.Sprite.prototype, ScheduleMethods);