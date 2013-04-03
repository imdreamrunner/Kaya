Kaya.Layer = Kaya.Class.extend({
  _children: [],

  constructor: function() {
    this.on('refresh', this.refresh);
  },

  run: function(parent){
    this.parent = parent;
    this.app = parent.app;
    this.createDOM();
    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  createDOM: function() {
    if (this.parent && this.parent.$DOM) {
      if (!this.$DOM) {
        this.$DOM = $('<div>');
        this.$DOM.css({
          position: 'absolute'
        });
        this.parent.$DOM.append(this.$DOM);
      }
      return true;
    } else {
      return false;
    }
  },

  // Remove the DOM create by itself.
  // Will be called when it is detached from its parent.
  removeDOM: function() {
    if (this.$DOM) {
      this.$DOM.remove();
      delete this.$DOM;
    }
  },

  // Add an instance of layer to the stage.
  attach: function(child) {
    if (typeof child.parent !== 'undefined') {
      throw new Error('Unable to attach child: it has been attached.');
    }

    // To avoid add the same layer to layer array.
    this.detach(child._id);

    child.run(this);
    this._children.push(child);
  },

  detach: function(child) {
    var index;
    if ((index = this._children.indexOf(child)) > -1) {
      child.removeDOM();
      delete child.parent;
      this._children.splice(index, 1);
      return true;
    }
    return false;
  },

  refresh: function() {
    this._children.forEach(function(child) {
      child.trigger('refresh');
    });
  },

  remove: function() {
    if (this.parent) {
      this.parent.detach(this._id);
    }
    this.off();
    this.stopListening();
    console.log('layer is removed.');
  }
});