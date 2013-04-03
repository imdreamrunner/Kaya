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
    this.fps = this.fps || 60;
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.$DOM.css({
      'background': this.background || '#000000',
      'width': this.size.width,
      'height': this.size.height
    });

    this.on('refresh', this.refresh);
    var refresh = function() {
      _this.trigger('refresh');
    };
    this.interval = setInterval(refresh, parseInt(1000 / this.fps));

    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  refresh: function() {
    if (this.currentStage) {
      this.currentStage.trigger('refresh');
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