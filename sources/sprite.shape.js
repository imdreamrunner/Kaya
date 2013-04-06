Kaya.Sprite.Rectangular = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float'
  },

  render: function() {
    this._super();
    this.context.fillStyle = this.get('color');
    this.context.fillRect(- this.get('width')/2, - this.get('height')/2, this.get('width'), this.get('height'));
  }
});