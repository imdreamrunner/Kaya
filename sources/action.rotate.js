Kaya.Action.Rotate = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);
    if (options.hasOwnProperty('target')) {
      this.target = options.target;
    } else {
      this.distance = options.distance;
    }
    this.duration = options.duration;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    if (!this.hasOwnProperty('target')) {
      if (typeof sprite.get('rotate') !== 'undefined') {
        this.target = this.distance + sprite.get('rotate');
      }
      this.target = this.distance;
    }
    this.origin = typeof sprite.get('rotate') !== 'undefined' ? sprite.get('rotate') : 0;
    this.length = this.duration;
    this.update();
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this.sprite.set('rotate', this.target);
      this._finish();
      return;
    }
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    sprite.set('rotate', this.origin + (this.target - this.origin) * this.timer / this.length);
  }
});

Kaya.Action.RotateTo = Kaya.Action.Rotate.extend({
  constructor: function(target, duration) {
    var options = {
      target: target,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.RotateBy = Kaya.Action.Rotate.extend({
  constructor: function(distance, duration) {
    var options = {
      distance: distance,
      duration: duration
    };
    this._super(options);
  }
});