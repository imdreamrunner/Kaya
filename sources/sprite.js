Kaya.Sprite = Kaya.Object.extend({
  beforeInitialize: function() {
  },

  afterInitialize: function() {
  },

  renderWrapper: function(context, width, height) {
    if (this.lazyRender) {
      if (this.rerender || !this.lazyRenderCanvas) {
        this.doRender(this.lazyRenderContext(width, height));
        this.rerender = false;
      } else {
        context.drawImage(this.lazyRenderCanvas, 0, 0);
      }
    } else {
      this.doRender(context);
    }
  },

  doRender: function(context) {
    // Save the context drawing center.
    context.save();
    // Move the drawing center.
    if (this.x || this.y) {
      context.translate(this.x || 0, this.y || 0);
    }
    // Do render
    this.render(context);
    // Restore context
    context.restore();
  },

  lazyRenderContext: function(width, height) {
    if (!this.lazyRenderCanvas) {
      this.lazyRenderCanvas = document.createElement('canvas');
      this.lazyRenderCanvas.width  = width;
      this.lazyRenderCanvas.height = height;
    }
    return this.lazyRenderCanvas.getContext('2d');
  },

  render: function(context) {

  }
});