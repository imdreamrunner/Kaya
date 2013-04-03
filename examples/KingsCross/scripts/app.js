var WelcomeStage = Kaya.Stage.extend({
  initialize: function() {

  }
});

var GameStage = Kaya.Stage.extend({

});

App = Kaya.App.extend({
  documentObject: '#Game',
  size: {
    width: 1024,
    height: 768
  },
  firstStage: new WelcomeStage()
});

var app = new App();
