Kaya.Resources = Kaya.Class.extend({
  constructor: function(app, resources) {
    this.app = app;

    var images = resources.images;
    this.imagesToLoad = images.length;
    this._images = {};
    for (var i in images) {
      if (images.hasOwnProperty(i)) {
        this._images[images[i]] = this.loadImage(images[i], this.imageLoaded.bind(this));
      }
    }
  },

  loadImage: function(file, callback) {
    var image = new Image();
    image.onload = callback;
    image.src = file;
    return image;
  },

  imageLoaded: function() {
    this.imagesToLoad--;
    if (this.imagesToLoad === 0) {
      console.log('All images are loaded.');
      this.app.run();
    }
  },

  images: function(file) {
    return this._images[file];
  }
});