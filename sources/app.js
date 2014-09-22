Kaya.App = Kaya.Object.extend({
  initialize: function() {
    var that = this;

    // Read documentObject
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }

    // Create _DOM object
    this._DOM = document.querySelector(this.documentObject);
    if (this._DOM === null) {
      throw new Error('App document object is not found.');
    }

    // Give default value for size.
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this._DOM.style.backgroundColor = this.background || '#000000';
    this._DOM.style.width = this.size.width + 'px';
    this._DOM.style.height = this.size.height + 'px';

    this._canvas = document.createElement('canvas');
    this._canvas.width  = this.size.width;
    this._canvas.height = this.size.height;
    this._DOM.appendChild(this._canvas);
    this._context = this._canvas.getContext('2d');

    // Handle touch event
    this.touchHandlers = this.touchHandlers || [];
    var touchEventHandler = function(e) {
      that.touchHandlers.forEach(function(handler) {
        handler(e.layerX, e.layerY);
      })
    };
    this._canvas.addEventListener('mousedown', touchEventHandler);
    this._canvas.addEventListener('touchstart', touchEventHandler);

    // Do refresh
    var that = this;
    var lastRefresh = new Date().getTime();
    var refresh = function() {
      var currentTime = new Date().getTime();
      var delta = currentTime - lastRefresh;
      lastRefresh = currentTime;
      that.trigger("refresh", delta);
      window.requestAnimationFrame(refresh, that._DOM);
    };
    refresh();

    // Display FPS
    if (Kaya.debug) {
      var fpsObject = document.querySelector("#fps");
      var updateFPS = function(delta) {
        fpsObject.innerHTML = Math.round(1000 / delta);
      };
      this.on("refresh", updateFPS);
    }
  },

  runStage: function(stage) {
    if (this._currentStage) {
      stage.trigger("leave");
    }
    this._currentStage = stage;
    stage._app = this;
    stage.trigger("enter");
  }
});
