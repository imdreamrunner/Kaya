Kaya.Sprite.Text = Kaya.Sprite.extend({
  dataTypes: {
    text: 'String',
    x: 'Float',
    y: 'Float',
    font: 'String'
  },

  render: function() {
    this._super();
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.font = this.get('size') + 'px ' + this.get('font');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.get('text'), 0, 0);
    this.actualWidth = this.context.measureText(this.get('text')).width;
  },

  isOver: function(touch) {
    return Math.abs(this.get('x') - touch.x) * 2 < this.actualWidth
      && Math.abs(this.get('y') - touch.y) * 2 < this.get('size');
  }
});