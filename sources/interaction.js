Kaya.Interaction = Kaya.Class.extend();

Kaya.Interaction.TouchEvent = Kaya.Class.extend({
  constructor: function(app) {
    var that = this;

    this.app = app;

    // Create event capture division.
    this.touchObject = document.createElement('div');
    this.touchObject.style.position = 'absolute';
    this.touchObject.style.width = app.size.width + 'px';
    this.touchObject.style.height = app.size.height + 'px';
    this.touchObject.style.backgroundColor = '#000';
    this.touchObject.style.opacity = 0;
    this.touchObject.style.zIndex = 1000;

    if (this.app.DOM.childNodes.length) {
      this.app.DOM.insertBefore(this.touchObject, this.app.DOM.childNodes[0]);
    } else {
      this.app.DOM.appendChild(this.touchObject);
    }

    this.touchObject.addEventListener('mousedown', function(e) {
      that.mouseDown.call(that, e);
    });
    this.touchObject.addEventListener('touchstart', function(e) {
      that.touchHandler.call(this, e);
    });
  },

  mouseDown: function(e) {
    var touch = {
      status: 'start',
      x: e.layerX,
      y: e.layerY
    };
    this.app.trigger('touchEvent',touch);
  },

  touchHandler: function(e) {
    console.log('handle touch event.');
  }
});