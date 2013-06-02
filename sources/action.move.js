Kaya.Action.Move = Kaya.Action.Timing.extend({
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
  run: function(sprite) {
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
    }
    if (this.duration) {
      this.length = this.duration;
    }
    // this.setSchedule(this.updater, 0);
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    for (var direction in this.directions) {
      if (this.directions.hasOwnProperty(direction)) {
        var _direction = this.directions[direction];
        sprite.set(direction, _direction.origin + _direction.distance / this.length * this.timer);
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    var sprite = this.sprite;
    if (this.timer >= this.length) {
      sprite.set('x', this.directions.x.target);
      sprite.set('y', this.directions.y.target);
      this._finish();
      return;
    }
    this.update();
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