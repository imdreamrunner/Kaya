Kaya.Action.Fade = Kaya.Action.extend({
  constructor: function(options) {
    this._super(options);
    this.target = options.target;
    this.duration = options.duration;
  }

});