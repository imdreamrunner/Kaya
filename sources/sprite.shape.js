Kaya.Sprite.Rectangle = Kaya.Sprite.extend({
  render: function(context) {
    context.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.color.a + ')';
    context.fillRect(- this.width/2, - this.height/2, this.width, this.width);
  }
});