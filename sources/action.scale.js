Kaya.Action.Scale = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);

    this.orientations = {width: {}, height:{}};

    for (var orientation in this.orientations) {
      this.orientations[orientation] = options[orientation];
    }

    // Set the duration of the move.
    if (options.duration) {
      this.duration = options.duration;
    }
  },

  // Overwrite the default run method.
  run: function(sprite) {
    this._super.apply(this, arguments);

    for (var orientation in this.orientations) {
      var _orientation = this.orientations[orientation];
      _orientation.origin = sprite.get(orientation);
      if (typeof _orientation.target === 'undefined') {
        // Target undefined.
        if (typeof _orientation.distance !== 'undefined') {
          _orientation.target = _orientation.origin + _orientation.distance;
        }
      } else {
        // Target is set.
        _orientation.distance = _orientation.target - _orientation.origin;
      }
    }
    if (this.duration) {
      this.length = this.duration;
    }
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    for (var orientation in this.orientations) {
      if (this.orientations.hasOwnProperty(orientation)) {
        var _orientation = this.orientations[orientation];
        sprite.set(orientation, _orientation.origin + _orientation.distance / this.length * this.timer);
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    var sprite = this.sprite;
    if (this.timer >= this.length) {
      sprite.set('width', this.orientations.width.target);
      sprite.set('height', this.orientations.height.target);
      this._finish();
      return;
    }
    this.update();
  }
});

Kaya.Action.ScaleTo = Kaya.Action.Scale.extend({
  constructor: function(width, height, duration) {
    var _options = {
      width: {target: width},
      height: {target: height},
      duration: duration
    };
    this._super(_options);
  }
});

Kaya.Action.ScaleBy = Kaya.Action.Scale.extend({
  constructor: function(width, height, duration) {
    var _options = {
      width: {distance: width},
      height: {distance: height},
      duration: duration
    };
    this._super(_options);
  }
});