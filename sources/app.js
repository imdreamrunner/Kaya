/*
 * Class App.
 */

Kaya.App = Kaya.Object.extend({
  constructor: function() {
    var that = this;
    if (!$) {
      throw new Error('jQuery is not loaded');
    }
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }
    this.$DOM = $(this.documentObject);
    if (this.$DOM.length === 0) {
      throw new Error('App frame "' + this.frame + '" is not found.');
    }
    this.fps = 60;
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.$DOM.css({
      'background': this.background || '#000000',
      'width': this.size.width,
      'height': this.size.height,
      'text-align': 'left'
    });

    // Create touch events capture instance.
    this.touchEvent = new Kaya.Interaction.TouchEvent(this);

    // Create touch event listener.
    this.on('touchEvent', this.touchEventHandler);

    // Create interval.
    this.on('refresh', this.refresh);

    var lastRefresh;
    var refresh = function() {
      requestAnimationFrame(refresh, that.$DOM[0]);
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
    $('#fps').html(Math.round(10000 / delta) / 10);
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