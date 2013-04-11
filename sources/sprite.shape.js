Kaya.Sprite.Rectangular = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float',
    alpha: 'Float',
    color: 'Color'
  },

  render: function() {
    this._super();
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.fillRect(- this.get('width')/2, - this.get('height')/2, this.get('width'), this.get('height'));
  },

  isTouched: function(touch) {
    return Math.abs(this.get('x') - touch.x) * 2 < this.get('width')
      && Math.abs(this.get('y') - touch.y) * 2 < this.get('height');
  }
});

Kaya.Sprite.Circle = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    radius: 'Float',
    alpha: 'Float',
    color: 'Color'
  },

  render: function() {
    this._super();
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.beginPath();
    this.context.arc(0, 0, this.get('radius'), 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fill();
  }
});