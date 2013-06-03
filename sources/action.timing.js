Kaya.Action.Timing = Kaya.Action.extend({
  run: function() {
    this._super.apply(this, arguments);
    this.timer = 0;
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    if (absolute) {
      this.timer = absolute
    } else {
      this.timer += delta;
    }
  }
});