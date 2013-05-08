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

      /*
      if (!this.duration) {
        var length = 0;
        if (_direction.acceleration) {
          length = - _direction.speed / _direction.acceleration
            + Math.sqrt(4 * Math.pow(_direction.speed / _direction.acceleration, 2)
            + 8 * _direction.distance / _direction.acceleration) / 2;
        } else if (_direction.speed) {
          length = _direction.distance / _direction.speed;
        }
        if (isNaN(length)) {
          throw new Error('Unable to calculate action length.');
        }
        _direction.length = parseInt(length);
        this.length = Math.max(this.length || 0, _direction.length);
      }
      */
    }
    if (this.duration) {
      this.length = this.duration;
    }
    this.timer = 0;
    this.setSchedule(this.updater, 0);
  },

  updater: function(schedule, delta) {
    var sprite = this.sprite;
    for (var direction in this.directions) {
      var _direction = this.directions[direction];
      sprite.set(direction, _direction.origin + _direction.distance / this.length * this.timer);
      /*
      if (_direction.acceleration || _direction.speed) {
        if (this.timer <= _direction.length) {
          sprite.set(direction,
            _direction.origin + _direction.speed * this.timer + _direction.acceleration * this.timer * this.timer / 2);
        }
      }
      */
    }
    if (this.timer >= this.length) {
      this._finish();
      return;
    }
    this.timer += delta;
  }
});

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

/*
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

Kaya.Action.AcceletateBy = Kaya.Action.Move.extend({
  constructor: function(x, y, accelerationX, accelerationY, speedX, speedY) {
    var _options = {
      x: {
        distance: x,
        acceleration: accelerationX || 0,
        speed: speedX || 0
      },
      y: {
        distance: y,
        acceleration: accelerationY || 0,
        speed: speedY || 0
      }
    };
    this._super(_options);
  }
});
*/