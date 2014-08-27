Kaya.Sprite = Kaya.Object.extend({
  renderWrapper: function(context, width, height) {
    if (this.lazyRender) {
      if (this.rerender || !this._lazyRenderCanvas) {
        this.translateAndRender(this.lazyRenderContext(width, height));
        this.rerender = false;
      } else {
        context.drawImage(this._lazyRenderCanvas, 0, 0);
      }
    } else {
      this.translateAndRender(context);
    }
  },

  translateAndRender: function(context) {
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
    if (!this._lazyRenderCanvas) {
      this._lazyRenderCanvas = document.createElement('canvas');
      this._lazyRenderCanvas.width  = width;
      this._lazyRenderCanvas.height = height;
    }
    return this._lazyRenderCanvas.getContext('2d');
  },

  render: function(context) {
  }
});