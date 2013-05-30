Kaya.Action.Ease = Kaya.Action.Timing.extend({
  constructor: function(action, points) {
    this._super.apply(this, arguments);

    if (points.length != 4) {
      throw new Error('Ease action must contain 2 Bezier control point.');
    }

    this.bezierAt = Kaya.Utilities.bezier(points[0], points[1], points[2], points[3], 1/60/4);
    this._action = action;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._action.run(this.sprite);
    this.length = this._action.length;
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this._action.timer = this._action.length;
      this._action.refresh(0);
      this._finish();
      return;
    }
    this._action.timer = parseInt(this._action.length * this.bezierAt(this.timer / this.length));
    console.log('ease refresh ' + this.timer / this.length + ' bezier ' + this.bezierAt(this.timer / this.length));
    this._action.refresh(0);
  }
});

Kaya.Action.EaseIn = Kaya.Action.Ease.extend({
  constructor: function(action) {
    this._super(action, [0.42, 0, 1, 1]);
  }
});

Kaya.Action.EaseOut = Kaya.Action.Ease.extend({
  constructor: function(action) {
    this._super(action, [0, 0, 0.58, 1]);
  }
});

Kaya.Action.EaseInOut = Kaya.Action.Ease.extend({
  constructor: function(action) {
    this._super(action, [0.42, 0, 0.58, 1]);
  }
});