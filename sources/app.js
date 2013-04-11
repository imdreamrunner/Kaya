/*
 * Class App.
 */

Kaya.App = Kaya.Object.extend({
  constructor: function() {
    var _this = this;
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
      'height': this.size.height
    });

    // Create touch events capture instance.
    this.touchEvent = new Kaya.Interaction.TouchEvent(this);

    // Create touch event listener.
    this.on('touchEvent', this.touchEventHandler);

    // Create interval.
    this.on('refresh', this.refresh);

    var countRefresh = 0;
    var lastRefresh;
    var refresh = function() {
      requestAnimationFrame(refresh, _this.$DOM[0]);
      if(!lastRefresh) {
        lastRefresh = new Date().getTime();
        return;
      }
      countRefresh ++;
      if (countRefresh === 10) {
        countRefresh = 0;
        var delta = (new Date().getTime() - lastRefresh) / 1000;
        lastRefresh = new Date().getTime();
        _this.fps = 10 / delta;
      }
      _this.trigger('refresh');
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

  refresh: function() {
    $('#fps').html(Math.round(this.fps * 10) / 10);
    if (this.currentStage) {
      this.currentStage.trigger('refresh', this.fps);
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