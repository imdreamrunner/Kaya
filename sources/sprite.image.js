Kaya.Sprite.Image = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float',
    file: 'String'
  },

  render: function() {
    this._super();
    var width = this.get('width');
    var height = this.get('height');
    this.context.drawImage(this.app.resources.images(this.get('file')), - width/2, - height/2, width, height);
  },

  isTouched: function(touch) {
    return Math.abs(this.get('x') - touch.x) * 2 <= this.get('width')
      && Math.abs(this.get('y') - touch.y) * 2 <= this.get('height');
  }
});