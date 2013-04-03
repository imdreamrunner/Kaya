Kaya.App = Kaya.Class.extend({
  constructor: function() {
    var _this = this;
    if (!$) {
      throw new Error('jQuery is not loaded');
    }
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }
    this.$documentObject = $(this.documentObject);
    if (this.$documentObject.length === 0) {
      throw new Error('App frame "' + this.frame + '" is not found.');
    }
    if (this.$documentObject.length > 1) {
      this.$documentObject = this.$documentObject[0];
    }
    this.fps = this.fps || 60;
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.$documentObject.css({
      'background': this.background || '#000000',
      'width': this.size.width,
      'height': this.size.height
    });

    this.firstStage.app = this;
    this.currentStage = this.firstStage;

    this.on('refresh', this.refresh);
    var refresh = function() {
      _this.trigger('refresh');
    };
    this.interval = setInterval(refresh, parseInt(1000 / this.fps));
  },

  refresh: function() {
    this.currentStage.trigger('refresh');
  },

  changeStage: function(targetStage) {
    this.currentStage.remove();
    this.currentStage = targetStage;
  }
});