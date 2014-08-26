Kaya.Action.Queue = Kaya.Action.Timing.extend({
  constructor: function(actions) {
    this._super.apply(this, arguments);
    this._actions = actions;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._actionQueue = Kaya.Utilities.clone(this._actions);
    this._runAction();
  },

  _runAction: function() {
    if (this._actionQueue.length > 0) {
      this._currentAction = this._actionQueue.shift();
      this._currentAction.run(this.sprite, this._runAction.bind(this));
      this._start = this.timer;
    } else {
      this._finish();
    }
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    if (absolute) {
      this._currentAction.refresh(0, absolute - this._start);
    } else {
      this._currentAction.refresh(delta);
    }
  }
});