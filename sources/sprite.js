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

  run: function(layer) {
    this.layer = layer;
    this.app = layer.app;
    this.context = layer.context;
    if (this.initialize) {
      this.initialize.call(this);
    }
    this.trigger('render');
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

  refresh: function(event, delta) {
    if (this._schedules) {
      this._schedules.forEach(function(schedule) {
        schedule.refresh(delta);
      }, this);
    }
    if (this._action) {
      this._action.refresh(delta);
    }
  },

  runAction: function(action, callback) {
    action.direct = true;
    this._action = action;
    callback ? action.run(this, callback) : action.run(this);
    return this;
  },

  finishAction: function(action) {
    delete this._action;
  },

  remove: function() {
    if (this.layer) {
      this.layer.detach(this);
    }
    this.off();
    this.stopListening();
  }
});

Kaya.Utilities.extend(Kaya.Sprite.prototype, ScheduleMethods);