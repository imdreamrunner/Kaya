Kaya.Interaction = Kaya.Class.extend();

Kaya.Interaction.TouchEvent = Kaya.Class.extend({
  constructor: function(app) {
    var _this = this;

    this.app = app;

    // Create event capture division.
    this.$touchObject = $('<div>');
    this.$touchObject.css({
      position: 'absolute',
      width: app.size.width,
      height: app.size.height,
      zIndex: 1000
    });
    this.app.$DOM.prepend(this.$touchObject);

    this.$touchObject.on('mousedown', function(e) {
      _this.mouseDown.call(_this, e);
    });

    this.$touchObject[0].addEventListener('touchstart', function(e) {
      _this.touchHandler.call(this, e);
    });
  },

  mouseDown: function(e) {
    var position = {
      x: e.offsetX,
      y: e.offsetY
    };
    this.app.trigger('touchstart', position);
  },

  touchHandler: function(e) {
    console.log('handle touch event.');
  }
});