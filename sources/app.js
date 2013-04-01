Kaya.App = Kaya.Class.extend({
  initialize: function() {
    if (!$) {
      throw new Error('jQuery is not loaded');
    }
    if (!this.frame) {
      throw new Error('No app frame is specified.');
    }
    this.$frame = $(this.frame);
    if (this.$frame.length === 0) {
      throw new Error('App frame "' + this.frame + '" is not found.');
    }
    if (this.$frame.length > 1) {
      this.$frame = this.$frame[0];
    }
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.$frame.css({
      'background': this.background || '#000000',
      'width': this.size.width,
      'height': this.size.height
    });

    this.currentStage = new this.firstStage(this);
  },

  changeStage: function(targetStage) {
    this.currentStage.remove();
    this.currentStage = new targetStage(this);
  }
});