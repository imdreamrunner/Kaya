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

function isMatch(a, b) {
  if (a.get('type') !== b.get('type')) {
    return false;
  }
  var layer = a.layer;
  function hasBrick(x, y) {
    var bricks = layer.where({
      left: x,
      top: y,
      exploded: false
    });
    return !!bricks.length;
  }
  var ax = a.get('left');
  var ay = a.get('top');
  var bx = b.get('left');
  var by = b.get('top');
  var t;
  if (ax > bx) {
    t = bx;
    bx = ax;
    ax = t;
    t = by;
    by = ay;
    ay = t;
  }

  function findMax(startX, startY, direction) {
    var vertical = direction === 0 || direction === 2;
    var step = (direction === 1 || direction === 2) ? 1 : -1;
    var target = vertical ? startY : startX;
    while (true) {
      target += step;
      if (target < 0) {
        return -1;
      }
      if (vertical) {
        if (target > (HEIGHT - 1)) {
          return HEIGHT
        }
        if (hasBrick(startX, target)) {
          return target - step;
        }
      } else {
        if (target > (WIDTH - 1)) {
          return WIDTH;
        }
        if (hasBrick(target, startY)) {
          return target - step;
        }
      }
    }
  }

  // Z style

  var ax_min = findMax(ax, ay, 3),
    ax_max = findMax(ax, ay, 1),
    bx_min = findMax(bx, by, 3),
    bx_max = findMax(bx, by, 1);

  var left = Math.max(ax_min, bx_min),
    right = Math.min(ax_max, bx_max);
  if (left <= right) {
    if (Math.abs(ay - by) === 1) {
      console.log('A');
      return true;
    }
    for (var tx = left; tx <= right; tx++) {
      if (ay < by) {
        if (findMax(tx, ay, 2) >= (by - 1)) {
          console.log('B');
          return true;
        }
      } else {
        if (findMax(tx, ay, 0) <= (by + 1)) {
          console.log('C');
          return true;
        }
      }
    }
  }

  // S style
  var ay_min = findMax(ax, ay, 0),
    ay_max = findMax(ax, ay, 2),
    by_min = findMax(bx, by, 0),
    by_max = findMax(bx, by, 2);

  var top = Math.max(ay_min, by_min),
    bottom = Math.min(ay_max, by_max);
  if (top <= bottom) {
    if (Math.abs(ax - bx) === 1) {
      console.log('D');
      return true;
    }
    for (var ty = top; ty <= bottom; ty++) {
      if (ax < bx) {
        if (findMax(ax, ty, 1) >= (bx - 1)) {
          console.log('E');
          return true;
        }
      } else {
        if (findMax(ax, ty, 3) <= (bx + 1)) {
          console.log('F');
          return true;
        }
      }
    }
  }

  return false;
}

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
    var brickLayer = new Kaya.Layer();
    this.attach(brickLayer);
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