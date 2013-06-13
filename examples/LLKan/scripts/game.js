var BrickColor = [
  '#F00',
  '#0F0',
  '#00F',
  '#FFF'
];

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

var Brick = Kaya.Sprite.Rectangular.extend({
  dataTypes: Kaya.Utilities.extend(Kaya.Sprite.Rectangular.prototype.dataTypes, {
    top: 'Integer',
    left: 'Integer',
    type: 'Integer'
  }),

  constructor: function() {
    this._super.apply(this, arguments);
    this.set('width', 40);
    this.set('height', 40);
    this.update();
    this.on('change', this.onChange);
  },

  onChange: function() {
    console.log(this._changes);
    if (this.hasChanged('type')) {
      this.update();
    }
  },

  update: function() {
    this.set({
      'color': BrickColor[this.get('type')],
      'x': 100 + this.get('left') * 40,
      'y': 100 + this.get('top') * 40
    });
  }
});

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
    function createBrick(type, left, top) {
      var brick = new Brick({
        top: top,
        left: left,
        type: type
      });
      brick.on('touch', function(){
        console.log(left, ' x ', top);
        //brick.set('color', '#555');
        brick.set('type', 3);
      });
      return brick;
    }
    var brickLayer = new Kaya.Layer();
    this.attach(brickLayer);
    var bricks = [];
    for (var top = 0; top < 14; top++) {
      bricks[top] = [];
      for (var left = 0; left < 10; left++) {
        bricks[top][left] = createBrick(randomNumber(3), top, left);
        brickLayer.attach(bricks[top][left]);
      }
    }
  }
});