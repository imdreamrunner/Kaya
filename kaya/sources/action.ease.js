Kaya.Action.Ease = Kaya.Action.Timing.extend({
  constructor: function(action, points, length) {
    this._super.apply(this, arguments);

    if (points.length != 4) {
      throw new Error('Ease action must contain 2 Bezier control point.');
    }

    this.bezierAt = Kaya.Utilities.bezier(points[0], points[1], points[2], points[3], 1/60/4);
    this._action = action;

    if (length) {
      this.length = length;
    }
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._action.run(this.sprite);
    if (!this.length) {
      if (this._action.length) {
        this.length = this._action.length;
      } else {
        throw new Error('Length of time is not defined for ease action.');
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this._action.refresh(0, this.length);
      this._finish();
      return;
    }
    this._action.refresh(0, parseInt(this.length * this.bezierAt(this.timer / this.length)));
  }
});

Kaya.Action.EaseIn = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0.42, 0, 1, 1], length);
  }
});

Kaya.Action.EaseOut = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0, 0, 0.58, 1], length);
  }
});

Kaya.Action.EaseInOut = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0.42, 0, 0.58, 1], length);
  }
});