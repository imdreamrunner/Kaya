Kaya.Stage = Kaya.Object.extend({
  _layers: [],

  constructor: function() {
    this.on('refresh', this.refresh);
    this.on('touchEvent', this.touchEventHandler);
  },

  run: function(app) {
    this.app = app;
    this.createDOM();
    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  createDOM: function() {
    if (this.app && this.app.$DOM) {
      if (!this.$DOM) {
        this.$DOM = $('<canvas width="' + this.app.size.width + '" height="' +  this.app.size.height + '">');
        this.$DOM.css({
          position: 'absolute'
        });
        this.app.$DOM.append(this.$DOM);
        this.context = this.$DOM[0].getContext('2d');
      }
    } else {
      throw new Error('Unable to create DOM');
    }
  },

  removeDOM: function() {
    if (this.$DOM) {
      this.$DOM.remove();
      delete this.$DOM;
    }
  },


  // Add an instance of layer to the stage.
  attach: function(layer) {
    if (typeof layer.stage !== 'undefined') {
      throw new Error('Unable to attach layer: the layer is already attached to a stage');
    }

    // To avoid add the same layer to layer array.
    this.detach(layer._id);

    layer.run(this);
    this._layers.push(layer);
  },

  // Remove a layer.
  // Will be call by layer's remove method.
  detach: function(layer) {
    var index;
    if ((index = this._layers.indexOf(layer)) > -1) {
      delete layer.parent;
      this._layers.splice(index, 1);
      return true;
    }
    return false;
  },

  eachLayer: function(callback) {
    this._layers.forEach(callback, this);
  },

  refresh: function(event, delta) {
    this.eachLayer(function(layer) {
      layer.trigger('refresh', delta);
    });

    // draw on canvas
    this.context.clearRect(0, 0, this.app.size.width, this.app.size.width);
    this.eachLayer(function(layer) {
      var layerImage = new Image();
      layerImage.src = layer.layerData();
      this.context.drawImage(layerImage, 0, 0, layerImage.width, layerImage.height);
    });
  },

  touchEventHandler: function(event, touch){
    // TODO: stop trigger next layer if event is caught.
    this.eachLayer(function(layer) {
      layer.trigger('touchEvent', touch);
    });
  },

  remove: function() {
    this.removeDOM();
    this.off();
    this.stopListening();
    console.log('stage is removed.');
  }
});