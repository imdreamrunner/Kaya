/*
 * Class Action.
 */

Kaya.Action = Kaya.Class.extend({
  constructor: function(options) {
    this._running = false;
  },

  run: function(sprite, callback) {
    this.sprite = sprite;
    if (callback) {
      this.callback = callback;
    }
    this._running = true;
  },

  refresh: function() {
    if (this._running && this._schedules){
      this._schedules.forEach(function(schedule) {
        schedule.refresh();
      }, this);
    }
  },

  // Remove itself from sprite when it is finished.
  _finish: function() {
    console.log('action finished');
    console.log((new Date()).getTime());
    if (this.callback) {
      this.callback.call(this.sprite);
    }
    this.removeSchedule();
    this.sprite.finishAction(this);
  }
});

Kaya.Action.Move = Kaya.Action.extend({
  constructor: function(options) {
    this._super(options);
    if (options.target) {
      if (typeof options.target.x !== 'undefined' && typeof options.target.y !== 'undefined') {
        this.target = options.target;
      }
    }
    if (options.duration) {
      this.duration = options.duration;
    }
  },

  // Overwrite the default run method.
  run: function(sprite){
    // Remember to call the origin method.
    this._super.apply(this, arguments);
    // Decide the speed by checking it direction.
    this.origin = {
      x: sprite.get('x'),
      y: sprite.get('y')
    };
    this.length = this.duration * sprite.app.fps;
    this.framesLeft = this.length;
    this.setSchedule(1, this.updater);
  },

  _speed: function() {
    var speed = {
      x: (this.target.x - this.origin.x) / this.length,
      y: (this.target.y - this.origin.y) / this.length
    };
    return speed;
  },

  updater: function() {
    var sprite = this.sprite;
    var speed = this._speed();
    if (!this.framesLeft) {
      sprite.set('x', this.target.x);
      sprite.set('y', this.target.y);
      this._finish();
      return;
    }
    sprite.set('x', sprite.get('x') + speed.x);
    sprite.set('y', sprite.get('y') + speed.y);
    this.framesLeft--;
  }
});

Kaya.Action.MoveTo = Kaya.Action.Move.extend({
  constructor: function(x, y, duration) {
    var options = {
      target: {x: x, y: y},
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Utilities.extend(Kaya.Action.prototype, ScheduleMethods);