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
    sprite.runAction(new Kaya.Action.MoveTo(100, 200, 1000));

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
    sprite2.runAction(new Kaya.Action.Queue([action1, action2]));

    var falling = new Kaya.Sprite.Circle({
      radius: 50,
      x: 700,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(falling);
    falling.runAction(new Kaya.Action.MoveTo(700, 500, 2500))
      .runAction(new Kaya.Action.Queue([new Kaya.Action.FadeOut(1500),
        new Kaya.Action.FadeIn(1000)]));

    var text = new Kaya.Sprite.Text({
      text: 'Hello World',
      x: 512,
      y: 100,
      font: '30px Arial',
      color: '#FFF'
    });
    layer.attach(text);
  }
});

var App = Kaya.App.extend({
  documentObject: '#Game',
  size: {
    width: 1024,
    height: 768
  },
  initialize: function() {
    this.runStage(new WelcomeStage());
  }
});

var app = new App();