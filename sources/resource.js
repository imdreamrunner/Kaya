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
  initialize: function() {
    var that = this;

    if (!this.list) {
      throw new Error("No resource list specified.");
    }
    this.size = this.list.length;

    this.progress = 0;
  },

  load: function() {
    var that = this;
    this.list.forEach(function(resource){
      resource.on("ready", function() {
        that.progress += 1;
        that.trigger("progress", that.progress, that.size);
        if (that.progress === that.size) {
          that.trigger("ready");
        }
      });
      resource.load();
    });
  }
});
