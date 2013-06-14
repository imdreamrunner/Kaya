var BrickColor = [
  '#F00',
  '#0F0',
  '#00F',
  '#FFF'
];

var Brick = Kaya.Sprite.Rectangular.extend({
  dataTypes: Kaya.Utilities.extend(Kaya.Sprite.Rectangular.prototype.dataTypes, {
    top: 'Integer',
    left: 'Integer',
    type: 'Integer'
  }),

  constructor: function() {
    this._super.apply(this, arguments);
    this.set({
      'width': 40,
      'height': 40,
      'exploded': false,
      'selected': false
    });
    this.update();
    this.on('change', this.onChange);
  },

  onChange: function() {
    if (this.hasChanged('type')) {
      this.update();
    }
    if (this.hasChanged('selected')) {
      if (this.get('selected')) {
        this.set('alpha', 0.8);
      }
    }
  },

  update: function() {
    this.set({
      'color': BrickColor[this.get('type')],
      'x': 100 + this.get('left') * 40,
      'y': 100 + this.get('top') * 40
    });
  },

  select: function() {
    this.set('selected', true);
  },

  explode: function() {
    if (!this.get('exploded')) {
      this.runAction(new Kaya.Action.FadeTo(0, 500));
      this.set('explode', true);
    }
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
        console.log(this.get('left'), ' x ', top);
        this.select();
      });
      return brick;
    }
    var brickLayer = new Kaya.Layer();
    this.attach(brickLayer);
    var brickTypes = [];
    for (var i = 0; i < 140; i++) {
      if (i < 70) {
        brickTypes[i] = 0;
      } else {
        brickTypes[i] = 1;
      }
    }
    brickTypes.sort(function() {
      return Math.round(Math.random());
    });
    var bricks = [];
    for (var top = 0; top < 10; top++) {
      for (var left = 0; left < 14; left++) {
        bricks[top*14 + left] = createBrick(brickTypes[top*14 + left], left, top);
        brickLayer.attach(bricks[top*14 + left]);
      }
    }
  }
});