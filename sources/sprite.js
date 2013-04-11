/*
 * Class Sprite.
 */

Kaya.Sprite = Kaya.Object.extend({
  constructor: function(properties) {
    this.set(properties);

    this.on('refresh', this.refresh);
    this.on('change', this.renderWrapper);
    this.on('touchEvent', this.touchEventHandler);
  },

  run: function(parent) {
    this.parent = parent;
    this.app = parent.app;
    this.createDOM();
    if (this.initialize) {
      this.initialize.call(this);
    }
    this.renderWrapper();
  },

  createDOM: function() {
    if (this.parent && this.parent.$DOM) {
      if (!this.$DOM) {
        this.$DOM = $('<canvas width="' + this.app.size.width + '" height="' +  this.app.size.height + '">');
        this.$DOM.css({
          position: 'absolute'
        });
        this.parent.$DOM.append(this.$DOM);
        this.context = this.$DOM[0].getContext('2d');
      }
    } else {
      throw new Error('Unable to create DOM');
    }
  },

  removeDOM: function() {
    console.log('remove dom')
    if (this.$DOM) {
      this.$DOM.remove();
      delete this.$DOM;
    }
  },

  // Default render function, which is empty.
  render: function() {},

  renderWrapper: function(event, render) {
    // Clear the canvas.
    this.context.clearRect(0, 0, this.app.size.width, this.app.size.width);
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
  refresh: function() {
    if (this._schedules) {
      this._schedules.forEach(function(schedule) {
        schedule.refresh();
      }, this);
    }
    if (this._actions) {
      this._actions.forEach(function(action) {
        action.refresh();
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