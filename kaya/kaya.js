/*
 * Kaya HTML5 Game Engine.
 * Author: Zhou Xinzi
 */

var Kaya = window.Kaya = function() {};

Kaya.version = '0.0.1';

Kaya.debug = 1;


var uniqueIdNumber = 0;
/*
 * Generate a unique id, which can be use everywhere you like.
 */
Kaya.uniqueId = function() {
  return ++uniqueIdNumber;
};

/*
 * Utilities use by Kaya framework.
 */

Kaya.Utilities = {
  extend: function(target) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source){
      if (source) {
        for (var name in source) {
          target[name] = source[name];
        }
      }
    });
    return target;
  },

  clone: function(source) {
    // Base on http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object

    if (typeof source !== 'object') {
      return source;
    }

    var target;

    // Handle Date
    if (source instanceof Date) {
      target = new Date();
      target.setTime(source.getTime());
      return target;
    }

    // Handle Array
    if (source instanceof Array) {
      target = Array.prototype.slice.call(source);
      return target;
    }

    // Handle Object
    if (source instanceof Object) {
      target = Kaya.Utilities.extend({}, source);
      return target;
    }

    throw new Error("Failed to clone an object.");
  },

  hexToRgb: function(hex) {
    // Code from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex: function(r, g, b) {
    function componentToHex(c) {
      if (c > 255) {
        c = 255;
      }
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  },

  bezier: function(x1, y1, x2, y2, epsilon){
    /*
     * from https://github.com/arian/cubic-bezier
     */

    var curveX = function(t){
      var v = 1 - t;
      return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
    };

    var curveY = function(t){
      var v = 1 - t;
      return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
    };

    var derivativeCurveX = function(t){
      var v = 1 - t;
      return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
    };

    return function(t){

      var x = t, t0, t1, t2, x2, d2, i;

      // First try a few iterations of Newton's method -- normally very fast.
      // Sometimes bugs appear when using this method, need to be fixed.
      /*
      for (t2 = x, i = 0; i < 8; i++){
        x2 = curveX(t2) - x;
        if (Math.abs(x2) < epsilon) return curveY(t2);
        d2 = derivativeCurveX(t2);
        if (Math.abs(d2) < 1e-6) break;
        t2 = t2 - x2 / d2;
      }
      */

      t0 = 0; t1 = 1; t2 = x;

      if (t2 < t0) return curveY(t0);
      if (t2 > t1) return curveY(t1);

      // Fallback to the bisection method for reliability.
      while (t0 < t1){
        x2 = curveX(t2);
        if (Math.abs(x2 - x) < epsilon) return curveY(t2);
        if (x > x2) t0 = t2;
        else t1 = t2;
        t2 = (t1 - t0) * .5 + t0;
      }

      // Failure
      return curveY(t2);

    };

  },

  shuffle: function(o){
    // http://jsfromhell.com/array/shuffle
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
};
/*
 * Class
 * Based on Simple JavaScript Inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 */

var initializingClass = false;

Kaya.Class = function() {};

// Return a sub class.
Kaya.Class.extend = function(prop) {
  var fnTest = /\b_super\b/;
  var _super = this.prototype;

  // Instantiate a base class (but only create the instance,
  // don't run the init constructor)
  initializingClass = true;
  var prototype = new this();
  initializingClass = false;

  // Copy the properties over onto the new prototype
  for (var name in prop) {
    // Check if we're overwriting an existing function
    prototype[name] = typeof prop[name] === "function" &&
      typeof _super[name] === "function" && fnTest.test(prop[name]) ?
      (function (name, fn) {
        return function () {
          var tmp = this._super;

          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name]) :
      prop[name];
  }

  // The dummy class constructor
  function Class() {
    // All construction is actually done in the initialize method
    if (!initializingClass) {
      // Generate an unique id for every class.
      this._id = Kaya.uniqueId();
      // Call the initialize method.

      if (this.constructor) {
        this.constructor.apply(this, arguments);
      }
    }
  }

  // Populate our constructed prototype object
  Class.prototype = prototype;

  // Enforce the constructor to be what we expect
  // Class.prototype.constructor = Class;

  Class.extend = Kaya.Class.extend;
  Class.join = Kaya.Class.join;

  return Class;
};
/*
 * Event Class
 * Inspired by Backbone.js
 */


Kaya.Event = Kaya.Class.extend({
  constructor: function(self, target, name, handler) {
    this.self = self;
    this.target = target;
    this.name = name;
    this.handler = handler;
    target.addListener(this);
    self.addListening(this);
  },

  trigger: function(argumentList) {
    argumentList.splice(0, 0, this);
    this.handler.apply(this.self, argumentList);
  },

  remove: function() {
    this.self.removeListening(this._id);
    this.target.removeListener(this._id);
  }
});

var EventMethods = {
  /*
   * Methods for events.
   */

  // Add an event to event list.
  addListener: function(event) {
    this._events = this._events || [];
    this._events.push(event);
  },

  // Remove an event from event list.
  removeListener: function(id) {
    if (this._events) {
      for (var i in this._events) {
        if (this._events[i]._id === id) {
          this._events.splice(i, 1);
          return;
        }
      }
    }
    throw new Error('Event not found when trying to remove it.');
  },

  // Add an event to listening list.
  addListening: function(event) {
    this._listening = this._listening || [];
    this._listening.push(event);
  },

  // Remove an event from listening list.
  removeListening: function(id) {
    if (this._listening) {
      for (var i in this._listening) {
        if (this._listening[i]._id === id) {
          this._listening.splice(i, 1);
          return;
        }
      }
    }
    throw new Error('Event not found when trying to remove it.');
  },

  // Listen to a self event.
  on: function(name, handler) {
    new Kaya.Event(this, this, name, handler);
    return this;
  },

  // Listen to a self event once.
  once: function(name, handler) {
    var onceHandler = function(event) {
      handler.apply(this, arguments);
      event.remove();
    };
    this.on(name, onceHandler);
    return this;
  },

  // Remove event handler from self.
  off: function() {
    // Read the arguments
    for (var i in arguments) {
      if (typeof arguments[i] === 'string') {
        var name = arguments[i];
      } else if (typeof arguments[i] === 'function') {
        var handler = arguments[i];
      } else if (typeof arguments[i] === 'object') {
        var self = arguments[i];
      }
    }

    if (this._events) {
      this._events.forEach(function(event) {
        if ((!name || event.name === name)
          && (!handler || event.handler === handler)
          && (!self || event.self === self)) {
          event.remove();
        }
      });
    }
    return this;
  },

  // Listen to an event of another object.
  listenTo: function(target, name, handler) {
    new Kaya.Event(this, target, name, handler);
    return this;
  },

  // Listen to an event of another object once.
  listenToOnce: function(target, name, handler) {
    var onceHandler = function(event) {
      handler.apply(this, arguments);
      event.remove();
    }
    this.listenTo(target, name, onceHandler);
    return this;
  },

  // Stop listening to event(s) from other objects.
  stopListening: function() {
    // Read the arguments
    for (var i in arguments) {
      if (typeof arguments[i] === 'string') {
        var name = arguments[i];
      } else if (typeof arguments[i] === 'function') {
        var handler = arguments[i];
      } else if (typeof arguments[i] === 'object') {
        var target = arguments[i];
      }
    }

    if (this._listening) {
      this._listening.forEach(function(event) {
        if ((!name || event.name === name)
          && (!handler || event.handler === handler)
          && (!target || event.target === target)) {
          event.remove();
        }
      });
    }
  },

  // Trigger an event.
  trigger: function(name) {
    var argumentList = Array.prototype.slice.call(arguments);
    argumentList.splice(0, 1);
    if (this._events) {
      for (var i in this._events) {
        if (this._events[i].name === name) {
          this._events[i].trigger(argumentList);
        }
      }
    }
    return this;
  }
};
Kaya.Object = Kaya.Class.extend({
  /*
   * Methods for Properties.
   */

  // Get the value of a property.
  get: function(name) {
    if (this._properties) {
      if (name) {
        return typeof this._properties[name] === 'undefined' ? undefined : this._properties[name];
      } else {
        return Kaya.Utilities.clone(this._properties);
      }
    } else {
      return undefined;
    }
  },

  _checkDataType: function(property, value) {
    switch (this.dataTypes ? this.dataTypes[property] || '' : '') {
      case 'Integer':
        return parseInt(value);
      case 'Float':
        return parseFloat(value);
      case 'String' :
        return String(value);
      default:
        return value;
    }
  },

  // Change the property(s).
  // set(properties, isSilent) or set(property, value)
  set: function() {
    var changes, silent = false;
    if (typeof arguments[0] === 'string' && typeof arguments[1] !== 'undefined') {
      changes = {};
      changes[arguments[0]] = arguments[1];
      if (arguments[2]) {
        silent = true;
      }
    } else if (typeof arguments[0] === 'object') {
      changes = arguments[0];
      if (arguments[1]) {
        silent = true;
      }
    }
    this._properties = this._properties || {};
    this._previous = this._previous || {};
    var changed = {}, isChanged = false;
    for (var name in changes) {
      if (changes.hasOwnProperty(name)) {
        changes[name] = this._checkDataType(name, changes[name]);
        if (this.get(name) === 'undefined'
          || this.get(name) !== changes[name]) {
          // Add or change a property
          this._previous[name] = this._properties[name];
          this._properties[name] = changes[name];
          changed[name] = changes[name];
          isChanged = true;
        }
      }
    }
    if (isChanged) {
      this._changes = changed;
      if (!silent) {
        this.trigger('change');
        for (var name in changed) {
          this.trigger('change:' + name);
        }
      }
    }
    return this;
  },

  // Delete a property.
  unset: function(name, silent) {
    if (this._properties && this._properties.hasOwnProperty(name)) {
      this._previous[name] = this._properties[name];
      delete this._properties[name];
      if (!silent) {
        this.trigger('change');
        this._changes = [].push(name);
      }
    }
    return this;
  },

  // Get the previous value of a property.
  // If name is not specified, return the array of all previous properties.
  previous: function(name) {
    if (this._previous) {
      if (name) {
        return this._previous[name] || undefined;
      } else {
        return Kaya.Utilities.clone(this._previous);
      }
    } else {
      return undefined;
    }
  },

  // Return whether a property has changed.
  hasChanged: function(name) {
    return this._changes && typeof this._changes[name] !== 'undefined';
  },

  changes: function() {
    return Kaya.Utilities.clone(this._changes);
  }
});

Kaya.Utilities.extend(Kaya.Object.prototype, EventMethods);
Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, handler, interval){
    this.self = self;
    this.interval = interval;
    this.handler = handler;
    this.timer = 0;
  },

  refresh: function(delta) {
    this.timer += delta;
    if (this.timer >= this.interval) {
      this.handler.call(this.self, this, delta);
      if (this.interval) {
        while (this.timer >= this.interval) {
          this.timer -= this.interval;
        }
      } else {
        this.timer = 0;
      }
    }
  },

  remove: function() {
    this.self.removeSchedule(this);
  }
});

ScheduleMethods = {
  setSchedule: function(handler, interval) {
    this._schedules = this._schedules || [];
    this._schedules.push(new Kaya.Schedule(this, handler, interval));
  },

  removeSchedule: function(schedule) {
    if (schedule) {
      var index = this._schedules.indexOf(schedule);
      if (index > -1) {
        this._schedules.splice(index, 1);
      } else {
        throw new Error('Unable to remove schedule: id not exist.');
      }
    } else {
      // Remove all schedules.
      if (this._schedules) {
        this._schedules.length = 0;
      }
    }
  }
};
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

    this.touchObject.addEventListener('mousemove', function(e) {
      that.mouseMove.call(that, e);
    });
    this.touchObject.addEventListener('mousedown', function(e) {
      that.mouseDown.call(that, e);
    });
    this.touchObject.addEventListener('touchstart', function(e) {
      that.touchHandler.call(that, e);
    });
  },

  mouseMove: function(e) {
    var position = {
      x: e.offsetX || e.layerX,
      y: e.offsetY || e.layerY
    };
    this.app.trigger('mouseMove', position);
  },

  mouseDown: function(e) {
    var touch = {
      status: 'start',
      x: e.offsetX || e.layerX,
      y: e.offsetY || e.layerY
    };
    this.app.trigger('touchEvent',touch);
  },

  touchHandler: function(e) {
    console.log('handle touch event.');
  }
});
Kaya.Resources = Kaya.Class.extend({
  constructor: function(app, resources) {
    this.app = app;

    var images = resources.images;
    this.imagesToLoad = images.length;
    this._images = {};
    for (var i in images) {
      if (images.hasOwnProperty(i)) {
        this._images[images[i]] = this.loadImage(images[i], this.imageLoaded.bind(this));
      }
    }
  },

  loadImage: function(file, callback) {
    var image = new Image();
    image.onload = callback;
    image.src = file;
    return image;
  },

  imageLoaded: function() {
    this.imagesToLoad--;
    if (this.imagesToLoad === 0) {
      console.log('All images are loaded.');
      this.app.run();
    }
  },

  images: function(file) {
    return this._images[file];
  }
});
/*
 * Class App.
 */

Kaya.App = Kaya.Object.extend({
  constructor: function() {
    var that = this;
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }
    this.DOM = document.querySelector(this.documentObject);
    if (this.DOM === null) {
      throw new Error('App document object is not found.');
    }
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this.DOM.style.backgroundColor = this.background || '#000000';
    this.DOM.style.width = this.size.width + 'px';
    this.DOM.style.height = this.size.height + 'px';

    // Create touch events capture instance.
    this.touchEvent = new Kaya.Interaction.TouchEvent(this);

    // Create touch event listener.
    this.on('touchEvent', this.touchEventHandler);
    this.on('mouseMove', this.mouseMoveHandler);

    // Create interval.
    this.on('refresh', this.refresh);

    // Browsers support
    if (window.mozRequestAnimationFrame) {
      window.requestAnimationFrame = mozRequestAnimationFrame;
    }
    if (window.webkitRequestAnimationFrame) {
      window.requestAnimationFrame = webkitRequestAnimationFrame;
    }

    var lastRefresh;
    var refresh = function() {
      requestAnimationFrame(refresh, that.DOM);
      if(!lastRefresh) {
        lastRefresh = new Date().getTime();
        return;
      }
      var newTime = new Date().getTime();
      var delta = newTime - lastRefresh;
      lastRefresh = newTime;
      that.trigger('refresh', delta);
    };
    refresh();

    if (this.resources) {
      this.resourcesList = this.resources;
      this.resources = new Kaya.Resources(this, this.resourcesList);
    } else {
      this.run();
    }
  },

  run: function() {
    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  touchEventHandler: function(event, touch) {
    if (this.currentStage) {
      this.currentStage.trigger('touchEvent', touch);
    }
  },

  mouseMoveHandler: function(event, position) {
    if (this.currentStage) {
      this.currentStage.trigger('mouseMove', position);
    }
  },

  refresh: function(event, delta) {
    document.querySelector('#fps').innerHTML = Math.round(10000 / delta) / 10;
    if (this.currentStage) {
      this.currentStage.trigger('refresh', delta);
    }
  },

  runStage: function(targetStage) {
    if (this.currentStage) {
      this.currentStage.remove();
    }
    targetStage.run(this);
    this.currentStage = targetStage;
  }
});
Kaya.Stage = Kaya.Object.extend({
  constructor: function() {
    this._layers = [];

    this.on('refresh', this.refresh);
    this.on('touchEvent', this.touchEventHandler);
    this.on('mouseMove', this.mouseMoveHandler);
  },

  run: function(app) {
    this.app = app;
    this.createDOM();
    if (this.initialize) {
      this.initialize.call(this);
    }
  },

  createDOM: function() {
    if (this.app && this.app.DOM) {
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width  = this.app.size.width;
        this.canvas.height = this.app.size.height;
        this.app.DOM.appendChild(this.canvas);
      }
      this.context = this.canvas.getContext('2d');
    } else {
      throw new Error('Unable to create DOM');
    }
  },

  removeDOM: function() {
    if (this.canvas) {
      this.canvas.parentNode.removeChild(this.canvas);
      delete this.canvas;
    }
  },


  // Add an instance of layer to the stage.
  attach: function(layer) {
    if (typeof layer.parent !== 'undefined') {
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
    // update layers
    this.eachLayer(function(layer) {
      layer.trigger('refresh', delta);
    });

    var stageContext = this.context;
    stageContext.clearRect(0, 0, this.app.size.width, this.app.size.width);

    this.eachLayer(function(layer) {
      stageContext.drawImage(layer.canvas, 0, 0);
    });
  },

  touchEventHandler: function(event, touch){
    // TODO: stop trigger next layer if event is caught.
    this.eachLayer(function(layer) {
      layer.trigger('touchEvent', touch);
    });
  },

  mouseMoveHandler: function(event, position) {
    this.eachLayer(function(layer) {
      layer.trigger('mouseMove', position);
    })
  },

  remove: function() {
    this.removeDOM();
    this.off();
    this.stopListening();
    console.log('stage is removed.');
  }
});
Kaya.Layer = Kaya.Object.extend({
  constructor: function() {
    this._children = [];
    this.changed = false;
    this.on('refresh', this.refresh);
    this.on('touchEvent', this.touchEventHandler);
    this.on('mouseMove', this.mouseMoveHandler);
  },

  run: function(parent){
    var that = this;
    this.parent = parent;
    this.app = parent.app;
    this.createCanvas();
    this.changed = true;
    this.eachChild(function(child) {
      child.run(that);
    });
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

    if (this.parent) {
      child.run(this);
    }
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

  childById: function(id) {
    return this._children[id];
  },

  eachChild: function(callback) {
    this._children.forEach(callback, this);
  },

  filter: function(iterator) {
    return this._children.filter(iterator);
  },

  where: function(properties) {
    return this.filter(function(child) {
      if (typeof properties !== 'undefined') {
        for (var name in properties) {
          if (properties.hasOwnProperty(name)) {
            if (child.get(name) !== properties[name]) {
              return false;
            }
          }
        }
      }
      return true;
    });
  },

  touchEventHandler: function(event, touch) {
    this.eachChild(function(child) {
      child.trigger('touchEvent', touch);
    });
  },

  mouseMoveHandler: function(event, position) {
    this.eachChild(function(child) {
      child.trigger('mouseMove', position);
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
/*
 * Class Sprite.
 */

Kaya.Sprite = Kaya.Object.extend({
  constructor: function(properties) {
    properties['hover'] = false;
    this.set(properties);

    this.on('refresh', this.refresh);
    this.on('render', this.renderWrapper);
    this.on('touchEvent', this.touchEventHandler);
    this.on('mouseMove', this.mouseMoveHandler);
  },

  run: function(layer) {
    this.layer = layer;
    this.app = layer.app;
    this.context = layer.context;
    if (this.initialize) {
      this.initialize.call(this);
    }
    this.trigger('render');
  },

  // Default render function, which is empty.
  render: function() {},

  renderWrapper: function(event, render) {
    // Save the context drawing center.
    this.context.save();
    // Move the drawing center.
    this.context.translate(this.get('x'), this.get('y'));
    if (render) {
      render.call(this);
    } else {
      this.render();
    }
    this.context.restore();
  },

  touchEventHandler: function(event, touch) {
    if (this.isOver(touch)) {
      touch['offsetX'] = touch.x - this.get('x');
      touch['offsetY'] = touch.y - this.get('y');
      this.trigger('touch', touch);
      return true;
    } else {
      return false;
    }
  },

  mouseMoveHandler: function(event, position) {
    this.set('hover', this.isOver(position));
  },

  isOver: function(touch) {
    return false;
  },

  refresh: function(event, delta) {
    if (this._schedules) {
      this._schedules.forEach(function(schedule) {
        schedule.refresh(delta);
      }, this);
    }
    if (this._action) {
      this._action.refresh(delta);
    }
  },

  runAction: function(action, callback) {
    action.direct = true;
    this._action = action;
    callback ? action.run(this, callback) : action.run(this);
    return this;
  },

  finishAction: function(action) {
    delete this._action;
  },

  remove: function() {
    if (this.layer) {
      this.layer.detach(this);
    }
    this.off();
    this.stopListening();
  }
});

Kaya.Utilities.extend(Kaya.Sprite.prototype, ScheduleMethods);
Kaya.Sprite.Text = Kaya.Sprite.extend({
  dataTypes: {
    text: 'String',
    x: 'Float',
    y: 'Float',
    font: 'String'
  },

  render: function() {
    this._super();
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.font = this.get('size') + 'px ' + this.get('font');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.get('text'), 0, 0);
    this.actualWidth = this.context.measureText(this.get('text')).width;
  },

  isOver: function(touch) {
    return Math.abs(this.get('x') - touch.x) * 2 < this.actualWidth
      && Math.abs(this.get('y') - touch.y) * 2 < this.get('size');
  }
});
Kaya.Sprite.Image = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float',
    file: 'String',
    hoverFile: 'String'
  },

  render: function() {
    this._super();
    if (typeof this.get('rotate') !== 'undefined') {
      this.context.rotate(this.get('rotate'));
    }
    if (this.get('alpha') !== undefined) {
      this.context.globalAlpha = this.get('alpha');
    }
    var width = this.get('width');
    var height = this.get('height');
    if (this.get('hoverFile') && this.get('hover')) {
      this.context.drawImage(this.app.resources.images(this.get('hoverFile')), - width/2, - height/2, width, height);
    } else {
      this.context.drawImage(this.app.resources.images(this.get('file')), - width/2, - height/2, width, height);
    }
  },

  isOver: function(touch) {
    var width = this.get('hoverWidth') || this.get('width');
    var height = this.get('hoverHeight') || this.get('height');
    return Math.abs(this.get('x') - touch.x) * 2 <= width
      && Math.abs(this.get('y') - touch.y) * 2 <= height;
  }
});
Kaya.Sprite.Rectangular = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    width: 'Float',
    height: 'Float',
    rotate: 'Float',
    alpha: 'Float',
    color: 'Color'
  },

  render: function() {
    this._super();
    if (typeof this.get('rotate') !== 'undefined') {
      this.context.rotate(this.get('rotate'));
    }
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.fillRect(- this.get('width')/2, - this.get('height')/2, this.get('width'), this.get('height'));
  },

  isOver: function(touch) {
    return Math.abs(this.get('x') - touch.x) * 2 <= this.get('width')
      && Math.abs(this.get('y') - touch.y) * 2 <= this.get('height');
  }
});

Kaya.Sprite.Circle = Kaya.Sprite.extend({
  dataTypes: {
    x: 'Float',
    y: 'Float',
    radius: 'Float',
    alpha: 'Float',
    color: 'Color'
  },

  render: function() {
    this._super();
    var color = Kaya.Utilities.hexToRgb(this.get('color'));
    var alpha = typeof this.get('alpha') === 'undefined'? 1 : this.get('alpha');
    this.context.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';
    this.context.beginPath();
    this.context.arc(0, 0, this.get('radius'), 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fill();
  }
});
/*
 * Class Action.
 */

Kaya.Action = Kaya.Class.extend({
  constructor: function(options) {
    this._running = false;
  },

  run: function(sprite, callback) {
    this.sprite = sprite;
    if (callback) {
      this.callback = callback;
    }
    this._running = true;
  },

  refresh: function(delta) {
    if (this._running && this._schedules){
      this._schedules.forEach(function(schedule) {
        schedule.refresh(delta);
      }, this);
    }
  },

  // Remove itself from sprite when it is finished.
  _finish: function() {
    if (this.callback) {
      this.callback.call(this.sprite);
    }
    this.removeSchedule();
    if (this.direct) {
      this.sprite.finishAction(this);
    }
  }
});

Kaya.Utilities.extend(Kaya.Action.prototype, ScheduleMethods);
Kaya.Action.Timing = Kaya.Action.extend({
  run: function() {
    this._super.apply(this, arguments);
    this.timer = 0;
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    if (absolute) {
      this.timer = absolute
    } else {
      this.timer += delta;
    }
  }
});
Kaya.Action.Ease = Kaya.Action.Timing.extend({
  constructor: function(action, points, length) {
    this._super.apply(this, arguments);

    if (points.length != 4) {
      throw new Error('Ease action must contain 2 Bezier control point.');
    }

    this.bezierAt = Kaya.Utilities.bezier(points[0], points[1], points[2], points[3], 1/60/4);
    this._action = action;

    if (length) {
      this.length = length;
    }
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._action.run(this.sprite);
    if (!this.length) {
      if (this._action.length) {
        this.length = this._action.length;
      } else {
        throw new Error('Length of time is not defined for ease action.');
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this._action.refresh(0, this.length);
      this._finish();
      return;
    }
    this._action.refresh(0, parseInt(this.length * this.bezierAt(this.timer / this.length)));
  }
});

Kaya.Action.EaseIn = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0.42, 0, 1, 1], length);
  }
});

Kaya.Action.EaseOut = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0, 0, 0.58, 1], length);
  }
});

Kaya.Action.EaseInOut = Kaya.Action.Ease.extend({
  constructor: function(action, length) {
    this._super(action, [0.42, 0, 0.58, 1], length);
  }
});
Kaya.Action.Fade = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);
    this.target = options.target;
    this.duration = options.duration;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this.origin = typeof sprite.get('alpha') !== 'undefined' ? sprite.get('alpha') : 1;
    this.length = this.duration;
    this.update();
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this.sprite.set('alpha', this.target);
      this._finish();
      return;
    }
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    sprite.set('alpha', this.origin + (this.target - this.origin) * this.timer / this.length);
  }
});

Kaya.Action.FadeTo = Kaya.Action.Fade.extend({
  constructor: function(target, duration) {
    var options = {
      target: target,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.FadeIn = Kaya.Action.Fade.extend({
  constructor: function(duration) {
    var options = {
      target: 1,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.FadeOut = Kaya.Action.Fade.extend({
  constructor: function(duration) {
    var options = {
      target: 0,
      duration: duration
    };
    this._super(options);
  }
});
Kaya.Action.Group = Kaya.Action.extend({
  constructor: function(actions) {
    this._super.apply(this, arguments);
    this._actionGroup = actions;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._runAction();
  },

  _runAction: function() {
    var that = this;
    this._actionGroup.forEach(function(action) {
      action.run(that.sprite, that._finishAction.bind(that, action));
    });
  },

  _finishAction: function(action) {
    var index = this._actionGroup.indexOf(action);
    if (index > -1) {
      this._actionGroup.splice(index, 1);
    } else {
      throw new Error('Unable to remove finished action.');
    }
    if (this._actionGroup.length === 0) {
      this._finish();
    }
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    this._actionGroup.forEach(function(action) {
      action.refresh(delta, absolute);
    });
  }
});
Kaya.Action.Move = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);

    this.directions = {x: {}, y:{}};

    for (var direction in this.directions) {
      this.directions[direction] = options[direction];
    }

    // Set the duration of the move.
    if (options.duration) {
      this.duration = options.duration;
    }
  },

  // Overwrite the default run method.
  run: function(sprite) {
    this._super.apply(this, arguments);

    for (var direction in this.directions) {
      var _direction = this.directions[direction];
      _direction.origin = sprite.get(direction);
      if (typeof _direction.target === 'undefined') {
        // Target undefined.
        if (typeof _direction.distance !== 'undefined') {
          _direction.target = _direction.origin + _direction.distance;
        }
      } else {
        // Target is set.
        _direction.distance = _direction.target - _direction.origin;
      }
    }
    if (this.duration) {
      this.length = this.duration;
    }
    // this.setSchedule(this.updater, 0);
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    for (var direction in this.directions) {
      if (this.directions.hasOwnProperty(direction)) {
        var _direction = this.directions[direction];
        sprite.set(direction, _direction.origin + _direction.distance / this.length * this.timer);
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    var sprite = this.sprite;
    if (this.timer >= this.length) {
      sprite.set('x', this.directions.x.target);
      sprite.set('y', this.directions.y.target);
      this._finish();
      return;
    }
    this.update();
  }
});

Kaya.Action.MoveTo = Kaya.Action.Move.extend({
  constructor: function(x, y, duration) {
    var _options = {
      x: {target: x},
      y: {target: y},
      duration: duration
    };
    this._super(_options);
  }
});

Kaya.Action.MoveBy = Kaya.Action.Move.extend({
  constructor: function(x, y, duration) {
    var _options = {
      x: {distance: x},
      y: {distance: y},
      duration: duration
    };
    this._super(_options);
  }
});
Kaya.Action.Queue = Kaya.Action.Timing.extend({
  constructor: function(actions) {
    this._super.apply(this, arguments);
    this._actions = actions;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    this._actionQueue = Kaya.Utilities.clone(this._actions);
    this._runAction();
  },

  _runAction: function() {
    if (this._actionQueue.length > 0) {
      this._currentAction = this._actionQueue.shift();
      this._currentAction.run(this.sprite, this._runAction.bind(this));
      this._start = this.timer;
    } else {
      this._finish();
    }
  },

  refresh: function(delta, absolute) {
    this._super.apply(this, arguments);
    if (absolute) {
      this._currentAction.refresh(0, absolute - this._start);
    } else {
      this._currentAction.refresh(delta);
    }
  }
});
Kaya.Action.Remove = Kaya.Action.extend({
  run: function(sprite) {
    sprite.remove();
    this._finish();
  }
});
Kaya.Action.Repeat = Kaya.Action.extend({
  constructor: function(action, times) {
    this._action = action;
    this._times = times;
  },

  run: function() {
    this._super.apply(this, arguments);
    this._times--;
    this._action.run(this.sprite, this._finishAction.bind(this));
  },

  _finishAction: function() {
    if (this._times === 0) {
      this._finish();
      return;
    } else if (this._times > 0) {
      this._times--;
    }
    this._action.run(this.sprite, this._finishAction.bind(this));
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    this._action.refresh(delta);
  }
});

Kaya.Action.Forever = Kaya.Action.Repeat.extend({
  constructor: function(action) {
    this._super(action, -1);
  }
});
Kaya.Action.Rotate = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);
    if (options.hasOwnProperty('target')) {
      this.target = options.target;
    } else {
      this.distance = options.distance;
    }
    this.duration = options.duration;
  },

  run: function(sprite) {
    this._super.apply(this, arguments);
    if (!this.hasOwnProperty('target')) {
      if (typeof sprite.get('rotate') !== 'undefined') {
        this.target = this.distance + sprite.get('rotate');
      }
      this.target = this.distance;
    }
    this.origin = typeof sprite.get('rotate') !== 'undefined' ? sprite.get('rotate') : 0;
    this.length = this.duration;
    this.update();
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    if (this.timer >= this.length) {
      this.sprite.set('rotate', this.target);
      this._finish();
      return;
    }
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    sprite.set('rotate', this.origin + (this.target - this.origin) * this.timer / this.length);
  }
});

Kaya.Action.RotateTo = Kaya.Action.Rotate.extend({
  constructor: function(target, duration) {
    var options = {
      target: target,
      duration: duration
    };
    this._super(options);
  }
});

Kaya.Action.RotateBy = Kaya.Action.Rotate.extend({
  constructor: function(distance, duration) {
    var options = {
      distance: distance,
      duration: duration
    };
    this._super(options);
  }
});
Kaya.Action.Scale = Kaya.Action.Timing.extend({
  constructor: function(options) {
    this._super(options);

    this.orientations = {width: {}, height:{}};

    for (var orientation in this.orientations) {
      this.orientations[orientation] = options[orientation];
    }

    // Set the duration of the move.
    if (options.duration) {
      this.duration = options.duration;
    }
  },

  // Overwrite the default run method.
  run: function(sprite) {
    this._super.apply(this, arguments);

    for (var orientation in this.orientations) {
      var _orientation = this.orientations[orientation];
      _orientation.origin = sprite.get(orientation);
      if (typeof _orientation.target === 'undefined') {
        // Target undefined.
        if (typeof _orientation.distance !== 'undefined') {
          _orientation.target = _orientation.origin + _orientation.distance;
        }
      } else {
        // Target is set.
        _orientation.distance = _orientation.target - _orientation.origin;
      }
    }
    if (this.duration) {
      this.length = this.duration;
    }
    this.update();
  },

  update: function() {
    var sprite = this.sprite;
    for (var orientation in this.orientations) {
      if (this.orientations.hasOwnProperty(orientation)) {
        var _orientation = this.orientations[orientation];
        sprite.set(orientation, _orientation.origin + _orientation.distance / this.length * this.timer);
      }
    }
  },

  refresh: function(delta) {
    this._super.apply(this, arguments);
    var sprite = this.sprite;
    if (this.timer >= this.length) {
      sprite.set('width', this.orientations.width.target);
      sprite.set('height', this.orientations.height.target);
      this._finish();
      return;
    }
    this.update();
  }
});

Kaya.Action.ScaleTo = Kaya.Action.Scale.extend({
  constructor: function(width, height, duration) {
    var _options = {
      width: {target: width},
      height: {target: height},
      duration: duration
    };
    this._super(_options);
  }
});

Kaya.Action.ScaleBy = Kaya.Action.Scale.extend({
  constructor: function(width, height, duration) {
    var _options = {
      width: {distance: width},
      height: {distance: height},
      duration: duration
    };
    this._super(_options);
  }
});