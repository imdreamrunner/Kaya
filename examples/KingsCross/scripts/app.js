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
    layer.attach(sprite);
    sprite.runAction(new Kaya.Action.MoveTo(100, 200));

    var sprite = new Kaya.Sprite.Rectangular({
      width: 100,
      height: 100,
      x: 300,
      y: 100,
      color: '#FFFFFF'
    });
    layer.attach(sprite);
    sprite.enqueueAction(new Kaya.Action.MoveTo(400, 100))
      .enqueueAction(new Kaya.Action.MoveTo(300, 100));
  }
});

App = Kaya.App.extend({
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