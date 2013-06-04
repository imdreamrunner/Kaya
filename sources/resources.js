Kaya.Resources = Kaya.Class.extend({
  constructor: function(app, resources) {
    this.app = app;

    var images = resources.images;
    this.numberOfImages = images.length;
    this.imagesToLoad = images.length;
    for (var i in images) {
      if (images.hasOwnProperty(i)) {
        this.loadImage(images[i], this.imageLoaded.bind(this));
      }
    }
  },

  loadImage: function(file, callback) {
    var image = new Image();
    image.onload = callback;
    image.src = file;
  },

  imageLoaded: function() {
    this.imagesToLoad--;
    if (this.imagesToLoad === 0) {
      console.log('All images are loaded.');
      this.app.run();
    }
  }
});