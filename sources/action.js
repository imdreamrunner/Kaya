Kaya.Action = Kaya.Object.extend({
  initialize: function() {
    this._app = this.sprite._app;
  },

  update: function(delta) { },

  start: function() {
    this._updateFunction = this.update.bind(this);
    this._app.on("refresh", this._updateFunction);
  },

  pause: function() {
    this._app.off("refresh", this._updateFunction);
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
    this._updateFunction = (function(delta) {
      that._passTime += delta;
      var progress = that._passTime / that.duration;
      if (progress >= 1) {
        progress = 1;
        that.trigger("finish");
        that._app.off("refresh", that._updateFunction);
      }
      that.update(progress);
    }).bind(this);
    this._app.on("refresh", this._updateFunction);
  }
});

Kaya.Action.LinearGradient = Kaya.Action.FiniteTime.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    if (!this.sprite) {
      throw new Error("Sprite is not defined");
    }
  },
  update: function(progress) {
    for (var prop in this.list) {
      this.sprite[prop] = this.list[prop].from + this.list[prop].distance * progress;
    }
  }
});

Kaya.Action.Move = Kaya.Action.LinearGradient.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this.list = {
      x: {
        from: this.sprite.x,
        distance: this.x
      },
      y: {
        from: this.sprite.y,
        distance: this.y
      }
    }
  }
});


Kaya.Action.Rotate = Kaya.Action.LinearGradient.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this.list = {
      rotate: {
        from: this.sprite.rotate || 0,
        distance: this.rotate
      }
    }
  }
});

Kaya.Action.Loop = Kaya.Action.extend({
  initialize: function() {
    this.count = 0;
    if (!this.action) {
      throw new Error("Action is not defined");
    }
    this._app = this.action._app;
  },

  start: function() {
    this.startAction();
  },

  startAction: function() {
    var that = this;
    var tempAction = new this.action;
    tempAction.on("finish", function() {
      that.count += 1;
      if (that.times === -1 || that.count < that.times) {
        // that.startAction();
        // Can this prevent recursive?
        setTimeout(that.startAction.bind(that), 0);
      }
    });
    tempAction.start();
  }

});
