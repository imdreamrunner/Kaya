Kaya.Stage = Kaya.Class.extend({
  initialize: function(app) {
    this.app = app;
  },

  remove: function() {
    console.log('stage is removed.');
  }
});