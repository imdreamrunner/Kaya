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
    sprite.runAction(new Kaya.Action.MoveTo(100, 200, 1));

    var sprite2 = new Kaya.Sprite.Rectangular({
      width: 100,
      height: 100,
      x: 300,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(sprite2);
    sprite2.enqueueAction(new Kaya.Action.MoveTo(360, 160, 1))
      .enqueueAction(new Kaya.Action.MoveTo(300, 100, 1));

    var falling = new Kaya.Sprite.Circle({
      radius: 50,
      x: 600,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(falling);
    falling.runAction(new Kaya.Action.AcceletateBy(200, 500, 0, 10, 100 , -200))
      .enqueueAction(new Kaya.Action.FadeOut(1.5))
      .enqueueAction(new Kaya.Action.FadeIn(1));

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