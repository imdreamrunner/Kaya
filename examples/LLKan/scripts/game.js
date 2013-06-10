var GameStage = Kaya.Stage.extend({
  initialize: function() {
    var layer = new Kaya.Layer();
    this.attach(layer);
    var text = new Kaya.Sprite.Text({
      text: 'Level 0',
      x: 360,
      y: 50,
      font: 'Arial',
      size: 30,
      color: '#FFF'
    });
    layer.attach(text);
    function createBrick(color, x, y) {
      var brick = new Kaya.Sprite.Rectangular({
        color: color,
        x: 100 + x*40,
        y: 100 + y*40,
        height: 40,
        width: 40
      });
      brick.on('touch', function(){
        console.log(x, ' x ', y);
        brick.set('color', '#555');
      });
      return brick;
    }
    var brickLayer = new Kaya.Layer();
    this.attach(brickLayer);
    var bricks = [];
    for (var x = 0; x < 10; x++) {
      bricks[x] = [];
      for (var y = 0; y < 10; y++) {
        bricks[x][y] = createBrick('#5D2', x, y);
        brickLayer.attach(bricks[x][y]);
      }
    }
  }
});