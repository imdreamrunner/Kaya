/*
var WelcomeStage = Kaya.Stage.extend({
  initialize: function() {
    var layer = new Kaya.Layer();
    this.attach(layer);
    var sprite = new Kaya.Sprite.Rectangular({
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      color: '#FFFFFF'
    });
    sprite.on('touch', function(event, touch) {
      console.log(touch);
    });
    layer.attach(sprite);
    var moveDownAction = new Kaya.Action.MoveTo(100, 500, 1500);
    var easeIn = new Kaya.Action.EaseIn(moveDownAction);
    var scaleTo = new Kaya.Action.ScaleTo(150, 150, 1500);
    var rotate = new Kaya.Action.RotateBy(0.5 * Math.PI, 1500);
    sprite.runAction(new Kaya.Action.Group([scaleTo, rotate]));

    var sprite2 = new Kaya.Sprite.Rectangular({
      width: 100,
      height: 100,
      x: 300,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(sprite2);
    var action1 = new Kaya.Action.MoveTo(360, 160, 1000);
    var action2 = new Kaya.Action.MoveTo(300, 100, 1000);
    sprite2.runAction(new Kaya.Action.Repeat(new Kaya.Action.Queue([action1, action2]), 2));

    var falling = new Kaya.Sprite.Circle({
      radius: 50,
      x: 700,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(falling);
    falling.runAction(
      new Kaya.Action.Group([
        new Kaya.Action.MoveTo(700, 500, 2500),
        new Kaya.Action.Queue([new Kaya.Action.FadeOut(1500),
          new Kaya.Action.FadeIn(1000)])
      ]));

    var text = new Kaya.Sprite.Text({
      text: 'Hello World',
      x: 512,
      y: 100,
      font: 'Arial',
      size: 30,
      color: '#FFF'
    });
    layer.attach(text);
  }
});

var App = Kaya.App.extend({
  documentObject: '#game',
  size: {
    width: 1024,
    height: 768
  },
  initialize: function() {
    this.runStage(new WelcomeStage());
  }
});

var app = new App();

*/

var sprite = new Kaya.Sprite.Rectangle({
  x: 100,
  y: 100,
  color: {
    r: 0,
    g: 200,
    b: 200,
    a: 200
  },
  width: 50,
  height: 50,
  lazyRender: false
});

var stage = new Kaya.Stage({
  sprites: [sprite],
  initialize: function() {
    console.log("stage run");
  }
});

var app = new Kaya.App({
  documentObject: "#game",
  size: {
    width: 500,
    height: 400
  },
  initialize: function() {
    console.log("app initialize");
    this.runStage(stage);
    sprite.rerender = true;
  }
});

/*
app.on("refresh", function(delta) {
  sprite.x += 50/delta;
  if (sprite.x > 400) {
    sprite.x = 0;
  }
});
*/

var move = new Kaya.Action.Move({
  x: 100,
  y: 100,
  duration: 1000,
  sprite: sprite,
  app: app
});

move.start();

console.log(app);
console.log(stage);
console.log(sprite);