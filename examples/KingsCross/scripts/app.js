var WelcomeStage = Kaya.Stage.extend({

});

var GameStage = Kaya.Stage.extend({

});

App = Kaya.App.extend({
  frame: '#GameFrame',
  size: {
    width: 1024,
    height: 768
  },
  firstStage: WelcomeStage
});

var app = new App();

app.changeStage(GameStage);