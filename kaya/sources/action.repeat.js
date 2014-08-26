Kaya.Action.Repeat = Kaya.Action.extend({
  constructor: function(action, times) {
    this._action = action;
    this._times = times;
  },

  run: function() {
    this._super.apply(this, arguments);
    this._times--;
    this._action.run(this.sprite, this._finishAction.bind(this));
  },

  _finishAction: function() {
    if (this._times === 0) {
      this._finish();
      return;
    } else if (this._times > 0) {
      this._times--;
    }
    this._action.run(this.sprite, this._finishAction.bind(this));
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    this._action.refresh(delta);
  }
});

Kaya.Action.Forever = Kaya.Action.Repeat.extend({
  constructor: function(action) {
    this._super(action, -1);
  }
});