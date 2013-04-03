Kaya.Sprite.Rectangular = Kaya.Sprite.extend({
  render: function() {
    this._super();
    this.context.clearRect(0, 0, this.app.size.width, this.app.size.width);
    this.context.fillStyle = this.get('color');
    this.context.fillRect(this.get('x'), this.get('y'), this.get('width'), this.get('height'));
  }
});