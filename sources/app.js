Kaya.App = Kaya.Class.extend({
  initialize: function() {
    if (!$) {
      throw new Error('jQuery is not loaded');
    }
    if (!this.documentObject) {
      throw new Error('No app documentObject is specified.');
    }
    this.$documentObject = $(this.documentObject);
    if (this.$documentObject.length === 0) {
      throw new Error('App documentObject "' + this.documentObject + '" is not found.');
    }
    if (this.$documentObject.length > 1) {
      this.$documentObject = this.$documentObject[0];
    }
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.$documentObject.css({
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