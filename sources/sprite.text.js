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
    this.context.font = this.get('font');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.get('text'), 0, 0);
    console.log('rendered text ' + this.get('text'));
  },

  isTouched: function(touch) {
    return false;
  }
});