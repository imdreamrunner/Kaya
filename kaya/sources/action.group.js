Kaya.Action.Group = Kaya.Action.extend({
  constructor: function(actions) {
    this._super.apply(this, arguments);
    this._actionGroup = actions;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._runAction();
  },

  _runAction: function() {
    var that = this;
    this._actionGroup.forEach(function(action) {
      action.run(that.sprite, that._finishAction.bind(that, action));
    });
  },

  _finishAction: function(action) {
    var index = this._actionGroup.indexOf(action);
    if (index > -1) {
      this._actionGroup.splice(index, 1);
    } else {
      throw new Error('Unable to remove finished action.');
    }
    if (this._actionGroup.length === 0) {
      this._finish();
    }
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    this._actionGroup.forEach(function(action) {
      action.refresh(delta, absolute);
    });
  }
});