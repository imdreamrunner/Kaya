var WelcomeStage = Kaya.Stage.extend({
  initialize: function() {
    console.log('i am initialized');
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
    layer.attach(text);
    var playButton = new Kaya.Sprite.Image({
      x: 360,
      y: 400,
      width: 160,
      height: 40,
      file: 'images/buttonPlay.png',
      hoverFile: 'images/buttonPlayHover.png'
    });
    playButton.on('touch', function(event, touch) {
      app.runStage(new GameStage);
    });
    layer.attach(playButton);
  }
});

var App = Kaya.App.extend({
  documentObject: '#Game',
  size: {
    width: 720,
    height: 540
  },
  resources: Resources,
  initialize: function() {
    this.runStage(new WelcomeStage());
  }
});

var app = new App();

console.log(app);