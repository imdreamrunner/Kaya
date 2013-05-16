Kaya.Action.Queue = Kaya.Action.extend({
  constructor: function(actions) {
    this._super.apply(this, arguments);
    this._actionQueue = actions;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._runAction();
    this.setSchedule(this.updater, 0);
  },

  _runAction: function() {
    if (this._actionQueue.length > 0) {
      this._currentAction = this._actionQueue.shift();
      this._currentAction.indirect = true;
      this._currentAction.run(this.sprite, this._runAction.bind(this));
    } else {
      this._finish();
    }
  },

  updater: function(schedule, delta) {
    this._currentAction.refresh(delta);
  }
});