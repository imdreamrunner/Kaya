Kaya.Action.Fade = Kaya.Action.extend({
  constructor: function(options) {
    this._super(options);
    this.target = options.target;
    this.duration = options.duration;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this.origin = sprite.get('alpha') || 1;
    this.length = this.duration * sprite.app.fps;
    this.timer = 0;
    this.setSchedule(1, this.updater);
  },

  updater: function() {
    var sprite = this.sprite;
    sprite.set('alpha', this.origin + (this.target - this.origin) * this.timer / this.length);
    if (this.timer >= this.length) {
      this._finish();
      return;
    }
    this.timer ++;
  }
});

Kaya.Action.FadeTo = Kaya.Action.Fade.extend({
  constructor: function(target, duration) {
    var options = {
      target: target,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.FadeIn = Kaya.Action.Fade.extend({
  constructor: function(duration) {
    var options = {
      target: 1,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.FadeOut = Kaya.Action.Fade.extend({
  constructor: function(duration) {
    var options = {
      target: 0,
      duration: duration
    };
    this._super(options);
  }
});