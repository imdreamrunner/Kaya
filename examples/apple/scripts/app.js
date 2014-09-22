
var apple = new Kaya.Resource.Image({
  src: "images/apple.png"
});

var resources = new Kaya.ResourceLoader({
  list: [apple]
});

function game() {
  var onTouch = function(x, y) {
    console.log(image.isAbove(x, y));
  };

  var app = new Kaya.App({
    documentObject: "#game",
    size: {
      width: 640,
      height: 960
    },
    displaySize: {
      width: 320,
      height:480
    },
    touchHandlers: [onTouch]
  });

  var sprite = new Kaya.Sprite.Rectangle({
    x: 100,
    y: 100,
    color: {
      r: 0,
      g: 200,
      b: 200
    },
    alpha: 0.5,
    width: 50,
    height: 50,
    lazyRender: false
  });

  var image = new Kaya.Sprite.Image({
    x: 250,
    y: 200,
    image: apple,
    alpha: 0.8,
    width: 200,
    height: 200
  });

  var stage = new Kaya.Stage();

  stage.addSprite(sprite, 2);
  stage.addSprite(image, 1);

  app.runStage(stage);

  var move = new Kaya.Action.Move({
    x: 300,
    y: 200,
    duration: 2000,
    sprite: sprite
  });

  move.start();

  var Rotate = Kaya.Action.Rotate.extend({
    rotate: Math.PI * 2,
    duration: 3000,
    sprite: image
  });

  (new Rotate).start();

  console.log(app);
  console.log(stage);
  console.log(sprite);
}

resources.on("ready", game);

resources.load();


