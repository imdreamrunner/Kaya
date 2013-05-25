/*
 * Class App.
 */

Kaya.App = Kaya.Object.extend({
  constructor: function() {
    var that = this;
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }
    this.DOM = document.querySelector(this.documentObject);
    if (this.DOM === null) {
      throw new Error('App document object is not found.');
    }
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.DOM.style.backgroundColor = this.background || '#000000';
    this.DOM.style.width = this.size.width + 'px';
    this.DOM.style.height = this.size.height + 'px';

    // Create touch events capture instance.
    this.touchEvent = new Kaya.Interaction.TouchEvent(this);

    // Create touch event listener.
    this.on('touchEvent', this.touchEventHandler);

    // Create interval.
    this.on('refresh', this.refresh);

    // Browsers support
    if (window.mozRequestAnimationFrame) {
      window.requestAnimationFrame = mozRequestAnimationFrame;
    }
    if (window.webkitRequestAnimationFrame) {
      window.requestAnimationFrame = webkitRequestAnimationFrame;
    }

    var lastRefresh;
    var refresh = function() {
      requestAnimationFrame(refresh, that.DOM);
      if(!lastRefresh) {
        lastRefresh = new Date().getTime();
        return;
      }
      var newTime = new Date().getTime();
      var delta = newTime - lastRefresh;
      lastRefresh = newTime;
      that.trigger('refresh', delta);
    };
    refresh();

    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  touchEventHandler: function(event, touch) {
    if (this.currentStage) {
      this.currentStage.trigger('touchEvent', touch);
    }
  },

  refresh: function(event, delta) {
    document.querySelector('#fps').innerHTML = Math.round(10000 / delta) / 10;
    if (this.currentStage) {
      this.currentStage.trigger('refresh', delta);
    }
  },

  runStage: function(targetStage) {
    if (this.currentStage) {
      this.currentStage.remove();
    }
    targetStage.run(this);
    this.currentStage = targetStage;
  }
});