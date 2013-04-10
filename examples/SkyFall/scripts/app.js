var MainStage = Kaya.Stage.extend({
  initialize: function() {
    var layer = new Kaya.Layer();
    this.attach(layer);
    function CreateShape() {
      var falling = new Kaya.Sprite.Rectangular({
        width: 50,
        height: 50,
        x: Math.random() * 1000,
        y: Math.random() * 100,
        color: '#7cb1d3',
        alpha: 0.2
      });
      layer.attach(falling);
      falling.runAction(new Kaya.Action.AcceletateBy(0, 700, 0, 10))
        .enqueueAction(new Kaya.Action.FadeIn(1))
        .enqueueAction(new Kaya.Action.FadeOut(1))
        .enqueueAction(new Kaya.Action.Remove());
    }
    setInterval(CreateShape, 150);
  }
});

App = Kaya.App.extend({
  documentObject: '#Game',
  size: {
    width: 1000,
    height: 600
  },
  initialize: function() {
    this.runStage(new MainStage());
  }
});

var app = new App();