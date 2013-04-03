Kaya.Stage = Kaya.Class.extend({
  layers: [],

  constructor: function() {
    this.on('refresh', this.refresh);
  },

  createDocumentObject: function() {
    if (this.app) {
      if (this.$documentObject) {
        this.$documentObject.remove();
      }
    } else {
      return false;
    }
  },

  refresh: function() {
    this.layers.forEach(function(layer) {
      layer.trigger('refresh');
    });
  },

  remove: function() {
    console.log('stage is removed.');
  }
});