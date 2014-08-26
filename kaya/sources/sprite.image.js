Kaya.Sprite.Image = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float',
    file: 'String',
    hoverFile: 'String'
  },

  render: function() {
    this._super();
    if (typeof this.get('rotate') !== 'undefined') {
      this.context.rotate(this.get('rotate'));
    }
    if (this.get('alpha') !== undefined) {
      this.context.globalAlpha = this.get('alpha');
    }
    var width = this.get('width');
    var height = this.get('height');
    if (this.get('hoverFile') && this.get('hover')) {
      this.context.drawImage(this.app.resources.images(this.get('hoverFile')), - width/2, - height/2, width, height);
    } else {
      this.context.drawImage(this.app.resources.images(this.get('file')), - width/2, - height/2, width, height);
    }
  },

  isOver: function(touch) {
    var width = this.get('hoverWidth') || this.get('width');
    var height = this.get('hoverHeight') || this.get('height');
    return Math.abs(this.get('x') - touch.x) * 2 <= width
      && Math.abs(this.get('y') - touch.y) * 2 <= height;
  }
});