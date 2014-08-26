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
        alpha: 0.1
      });
      layer.attach(falling);
      var queue = new Kaya.Action.Queue([
        new Kaya.Action.FadeIn(1000),
        new Kaya.Action.FadeOut(1000),
        new Kaya.Action.Remove()
      ]);
      var group = new Kaya.Action.Group([
        queue,
        new Kaya.Action.MoveBy(0, 700, 1500)
      ]);
      var ease = new Kaya.Action.EaseIn(group, 1500);
      falling.runAction(ease);
    }
    layer.setSchedule(CreateShape, 100);
  }
});

var App = Kaya.App.extend({
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