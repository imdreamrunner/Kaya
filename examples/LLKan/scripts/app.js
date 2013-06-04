var WelcomeStage = Kaya.Stage.extend({
  initialize: function() {
    var layer = new Kaya.Layer();
    this.attach(layer);
    var text = new Kaya.Sprite.Text({
      text: 'LLKan V0.1',
      x: 360,
      y: 100,
      font: 'Arial',
      size: 30,
      color: '#FFF'
    });
    text.on('touch', function(event, touch) {
      console.log(touch);
    });
    layer.attach(text);
  }
});

var App = Kaya.App.extend({
  documentObject: '#Game',
  size: {
    width: 720,
    height: 540
  },
  initialize: function() {
    this.runStage(new WelcomeStage());
  }
});

var app = new App();