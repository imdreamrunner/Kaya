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

    this.directions = {x: {}, y:{}};

    for (var direction in this.directions) {
      this.directions[direction] = options[direction];
    }

    // Set the duration of the move.
    if (options.duration) {
      this.duration = options.duration;
    }
  },

  // Overwrite the default run method.
  run: function(sprite){
    // Remember to call the origin method.
    this._super.apply(this, arguments);

    for (var direction in this.directions) {
      var _direction = this.directions[direction];
      _direction.origin = sprite.get(direction);
      if (typeof _direction.target === 'undefined') {
        // Target undefined.
        if (typeof _direction.distance !== 'undefined') {
          _direction.target = _direction.origin + _direction.distance;
        }
      } else {
        // Target is set.
        _direction.distance = _direction.target - _direction.origin;
      }
      _direction.speed = _direction.speed || 0;
      _direction.apf = _direction.acceleration ? _direction.acceleration / sprite.app.fps : 0;

      if (!this.duration) {
        var length = 0;
        if (_direction.apf) {
          length = - _direction.speed / _direction.apf
            + Math.sqrt(4 * Math.pow(_direction.speed / _direction.apf, 2)
                          + 8 * _direction.distance / _direction.apf) / 2;
        } else if (_direction.speed) {
          length = _direction.length / _direction.speed;
        }
        this.length = Math.max(this.length || 0, parseInt(length));
      }
    }
    if (this.duration) {
      this.length = this.duration * sprite.app.fps;
    }
    this.timer = 0;
    this.setSchedule(1, this.updater);
  },

  updater: function() {
    var sprite = this.sprite;
    for (var direction in this.directions) {
      var _direction = this.directions[direction];
      sprite.set(direction, _direction.origin + _direction.distance / this.length * this.timer);
    }
    if (this.timer === this.length) {
      this._finish();
      return;
    }
    this.timer ++;
  }
});

Kaya.Utilities.extend(Kaya.Action.prototype, ScheduleMethods);

Kaya.Action.MoveTo = Kaya.Action.Move.extend({
  constructor: function(x, y, duration) {
    var _options = {
      x: {target: x},
      y: {target: y},
      duration: duration
    };
    this._super(_options);
  }
});

Kaya.Action.MoveBy = Kaya.Action.Move.extend({
  constructor: function(x, y, duration) {
    var _options = {
      x: {distance: x},
      y: {distance: y},
      duration: duration
    };
    this._super(_options);
  }
});

Kaya.Action.AcceletateTo = Kaya.Action.Move.extend({
  constructor: function(x, y, accelerationX, accelerationY, speedX, speedY) {
    var _options = {
      x: {
        target: x,
        acceleration: accelerationX || 0,
        speed: speedX || 0
      },
      y: {
        target: y,
        acceleration: accelerationY || 0,
        speed: speedY || 0
      }
    };
    this._super(_options);
  }
});