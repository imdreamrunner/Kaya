Kaya.Action = Kaya.Object.extend({
  initialize: function() {
    if (!this.sprite) {
      throw new Error("Sprite is not defined");
    }
  },

  update: function(delta) { },

  start: function() {
    this._updateFunction = this.update.bind(this);
    this.app.on("refresh", this._updateFunction);
  },

  pause: function() {
    this.app.off("refresh", this._updateFunction);
  }
});

Kaya.Action.FiniteTime = Kaya.Action.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    if (!this.duration) {
      throw new Error("Duration is not defined for a finite action.");
    }
    this._passTime = 0;
  },

  start: function() {
    var that = this;
    this._updateFunction = function(delta) {
      if (that._passTime === 1) {
        that.trigger("finish");
        return;
      }
      that._passTime += delta;
      var progress = that._passTime / that.duration;
      if (progress >= 1) {
        progress = 1;
      }
      that.update(progress);
    };
    this.app.on("refresh", this._updateFunction);
  }
});

Kaya.Action.Move = Kaya.Action.FiniteTime.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this._startLocation = {
      x: this.sprite.x,
      y: this.sprite.y
    }
  },

  update: function(progress) {
    this.sprite.x = this._startLocation.x + this.x * progress;
    this.sprite.y = this._startLocation.y + this.y * progress;
  }
});