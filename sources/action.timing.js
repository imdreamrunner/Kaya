Kaya.Action.Timing = Kaya.Action.extend({
  run: function() {
    this._super.apply(this, arguments);
    this.timer = 0;
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    this.timer += delta;
  }
});