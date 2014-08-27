Kaya.Resource = Kaya.Object.extend({
  initialize: function() {
    var that = this;
    this.ready = false;
    this.on("ready", function() {
      that.ready = true;
    })
  },
  load: function() {}
});

Kaya.Resource.Image = Kaya.Resource.extend({
  load: function() {
    var that = this;
    this.image = new Image();
    this.image.onload = function() {
      that.trigger("ready");
    };
    this.image.src = this.src;
  }
});

Kaya.ResourceLoader = Kaya.Object.extend({

});