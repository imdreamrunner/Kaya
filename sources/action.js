Kaya.Action = Kaya.Class.extend({
  constructor: function() {

  }
});

Kaya.Action.Move = Kaya.Action.extend({
  constructor: function(options) {
    this._super();
    if (options.target) {
      if (typeof options.target.x !== 'undefined' && typeof options.target.y !== 'undefined')
      this.target = options.target;
    }
  },

  run: function() {

  },

  update: function() {

  }
});

Kaya.Utilities.extend(Kaya.Action, ScheduleMethods);