Kaya.App = Kaya.Object.extend({
  beforeInitialize: function() {
    // Read documentObject
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }

    // Create DOM object
    this.DOM = document.querySelector(this.documentObject);
    if (this.DOM === null) {
      throw new Error('App document object is not found.');
    }

    // Give default value for size.
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
  },

  afterInitialize: function() {
    // Do refresh
    var that = this;
    var lastRefresh = new Date().getTime();
    var refresh = function() {
      var currentTime = new Date().getTime();
      var delta = currentTime - lastRefresh;
      lastRefresh = currentTime;
      that.trigger("refresh", delta);
      window.requestAnimationFrame(refresh, that.DOM);
    };
    refresh();

    // Display FPS
    if (Kaya.debug) {
      var fpsObject = document.querySelector("#fps");
      var updateFPS = function(delta) {
        fpsObject.innerHTML = Math.round(1000 / delta);
      }
      this.on("refresh", updateFPS);
    }
  }
});