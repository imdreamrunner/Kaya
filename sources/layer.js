Kaya.Layer = Kaya.Object.extend({
  _children: [],

  constructor: function() {
    this.changed = false;
    this.on('refresh', this.refresh);
    this.on('touchEvent', this.touchEventHandler);
  },

  run: function(parent){
    this.parent = parent;
    this.app = parent.app;
    this.createCanvas();
    this.changed = true;
    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  createCanvas: function() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width  = this.app.size.width;
      this.canvas.height = this.app.size.height;
    }
    this.context = this.canvas.getContext('2d');
  },

  // Add an instance of layer to the stage.
  attach: function(child) {
    if (typeof child.parent !== 'undefined') {
      throw new Error('Unable to attach child: it has been attached.');
    }

    // To avoid add the same layer to layer array.
    this.detach(child._id);

    this.listenTo(child, 'change', this.change);

    child.run(this);
    this._children.push(child);
  },

  detach: function(child) {
    var index;
    if ((index = this._children.indexOf(child)) > -1) {
      delete child.parent;
      this.stopListening(child);
      this._children.splice(index, 1);
      return true;
    }
    return false;
  },

  eachChild: function(callback) {
    this._children.forEach(callback, this);
  },

  touchEventHandler: function(event, touch) {
    this.eachChild(function(child) {
      child.trigger('touchEvent', touch);
    });
  },

  change: function() {
    this.changed = true;
  },

  refresh: function(event, delta) {
    // update the schedules
    if (this._schedules) {
      this._schedules.forEach(function(schedule) {
        schedule.refresh(delta);
      }, this);
    }

    // Refresh the children.
    this.eachChild(function(child) {
      child.trigger('refresh', delta);
    });

    if (this.changed) {
      this.changed = false;
      // Clear the canvas.
      this.context.clearRect(0, 0, this.app.size.width, this.app.size.width);
      // render the child
      this.eachChild(function(child) {
        child.trigger('render');
      });
    }
  },

  remove: function() {
    if (this.parent) {
      this.parent.detach(this);
    }
    this.off();
    this.stopListening();
  }
});

Kaya.Utilities.extend(Kaya.Layer.prototype, ScheduleMethods);