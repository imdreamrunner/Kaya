Kaya.Article = Kaya.Class.extend({
  initialize: function(layer) {
    this.layer = layer;
  },

  remove: function() {
    console.log('article is removed.');
  }
});