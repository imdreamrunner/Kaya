Kaya.Sprite.Rectangle = Kaya.Sprite.extend({
  render: function() {
    this.app.context.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a + ')';
    this.app.context.fillRect(- this.width/2, - this.height/2, this.width, this.width);
  }
});