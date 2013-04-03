Kaya.Layer = Kaya.Class.extend({
  actors: [],

  constructor: function(stage) {
    this.stage = stage;
    this.on('refresh', this.refresh);
  },

  refresh: function() {
    this.actors.forEach(function(actor){
      actor.trigger('refresh');
    });
  }
});