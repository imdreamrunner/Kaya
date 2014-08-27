Kaya.Sprite = Kaya.Object.extend({
  beforeInitialize: function() {
  },

  afterInitialize: function() {
  },

  renderWrapper: function() {
    // Save the context drawing center.
    this.app.context.save();
    // Move the drawing center.
    if (this.x || this.y) {
      this.app.context.translate(this.x || 0, this.y || 0);
    }
    // Do render
    this.render();
    // Restore context
    this.app.context.restore();
  }
});