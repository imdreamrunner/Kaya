Kaya.Layer = Kaya.Class.extend({
  initialize: function(stage) {
    this.stage = stage;
  },

  remove: function() {
    console.log('layer is removed.');
  }
});