Kaya.Sprite = Kaya.Object.extend({
  renderWrapper: function() {
    var context = this._app._context;
    var width = this._app.size.width;
    var height = this._app.size.height;

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
    // Rotate the canvas.
    if (this.rotate) {
      context.rotate(this.rotate);
    }
    // Set alpha.
    if (this.alpha) {
      context.globalAlpha = this.alpha;
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
  },

  above: function(x, y) {
    return Math.abs(x) * 2 <= this.width
        && Math.abs(y) * 2 <= this.height;
  },

  aboveOnCanvas: function(x, y) {

  }
});


Kaya.Sprite.Rectangle = Kaya.Sprite.extend({
  render: function(context) {
    context.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    context.fillRect(- this.width/2, - this.height/2, this.width, this.width);
  }
});

Kaya.Sprite.Image = Kaya.Sprite.extend({
  render: function(context) {
    context.drawImage(this.image.image, - this.width/2, - this.height/2, this.width, this.height);
  }
});

Kaya.Sprite.SpriteSheet = Kaya.Sprite.extend({
  render: function(context) {
    context.drawImage(this.image.image, - this.width/2, - this.height/2, this.width, this.height);
  }
});
