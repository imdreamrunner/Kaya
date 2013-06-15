var WIDTH = 14;
var HEIGHT = 10;
var LEVEL = {
  0: 20,
  1: 20,
  2: 20,
  3: 20,
  4: 30,
  5: 30
};

var BrickColor = [
  '#F00',
  '#0F0',
  '#00F',
  '#FF0',
  '#0FF',
  '#F0F'
];


var Fire = Kaya.Sprite.Rectangular.extend({
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
      'x': 100 + this.get('left') * 40,
      'y': 100 + this.get('top') * 40,
      'color': '#FFF',
      alpha: 0.8
    });
  }
});

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
      } else {
        this.set('alpha', 1);
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
    if (this.get('exploded')) {
      return;
    }
    if (this.get('selected')) {
      return;
    }
    var selectedList = this.layer.where({selected: true});
    if (selectedList.length === 1) {
      var target = selectedList[0];
      if (isMatch(this, target)) {
        drawFire(this, target);
        this.explode();
        target.explode();
      } else {
        this.set('selected', false);
        target.set('selected', false);
      }
    } else {
      this.set('selected', true);
    }
  },

  explode: function() {
    if (!this.get('exploded')) {
      this.runAction(new Kaya.Action.FadeTo(0, 500));
      this.set({
        'exploded': true,
        'selected': false
      });
    }
  }
});

var brickLayer = new Kaya.Layer();
var fireLayer = new Kaya.Layer();

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
        this.select();
      });
      return brick;
    }
    this.attach(brickLayer);
    this.attach(fireLayer);
    var brickTypes = [];
    var total = 0;
    for (var type in LEVEL) {
      if (LEVEL.hasOwnProperty(type)) {
        for (var i = 0; i < LEVEL[type]; i++) {
          brickTypes[total + i] = type;
        }
        total += LEVEL[type];
      }
    }
    Kaya.Utilities.shuffle(brickTypes);
    for (var top = 0; top < HEIGHT; top++) {
      for (var left = 0; left < WIDTH; left++) {
        brickLayer.attach(createBrick(brickTypes[top*WIDTH + left], left, top));
      }
    }
  }
});