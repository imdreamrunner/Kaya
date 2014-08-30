/*
 * Kaya HTML5 Game Engine.
 * Author: Ivor, ZHOU Xinzi
 */

var Kaya = window.Kaya = function() {};

Kaya.version = '0.0.1';

Kaya.debug = true;


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
 *
 * Modified to use Object.clone to replace new for inheritance.
 */

Kaya.Class = function() {};

// Return a sub class.
Kaya.Class.extend = function(prop) {
  // var fnTest = /\b_super\b/;
  var _super = this.prototype;

  // Instantiate a base class (but only create the instance,
  // don't run the init constructor
  var prototype = Object.create(this.prototype);

  // Copy the properties over onto the new prototype
  for (var name in prop) {
    // Check if we're overwriting an existing function
    if (prop.hasOwnProperty(name)) {
      if (typeof prop[name] === "function") {
        prototype[name] = (function (name, fn) {
          return function () {
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);

            delete this['_super'];

            return ret;
          };
        })(name, prop[name]);
      } else {
        prototype[name] = prop[name];
      }
    }
  }

  // The dummy class constructor
  function KayaObject() {
    if (this.constructor) {
      this.constructor.apply(this, arguments);
    }
  }

  // Populate our constructed prototype object
  KayaObject.prototype = prototype;

  // Enforce the constructor to be what we expect
  KayaObject.constructor = KayaObject;

  KayaObject.extend = Kaya.Class.extend;

  return KayaObject;
};
Kaya.Object = Kaya.Class.extend({
  constructor: function(prop) {
    // Prepare for event
    this._events = [];

    // Override properties
    for (var m in prop) {
      this[m] = prop[m];
    }

    // Run initialize
    if (this.initialize) {
      this.initialize();
    }

    this.trigger("initialized");
  },

  on: function(event, listener) {
    this._events[event] = this._events[event] || [];
    this._events[event].push(listener);
  },

  off: function(event, listener) {
    if (this._events[event]) {
      var i = this._events[event].indexOf(listener);
      this._events[event].splice(i, 1);
    }
  },

  trigger: function() {
    var argumentList = Array.prototype.slice.call(arguments);
    argumentList.splice(0, 1);
    var listeners = this._events[arguments[0]];
    if (!listeners) return;
    listeners.forEach(function (listener) {
      listener.apply(this, argumentList);
    });
  }

});
Kaya.Resource = Kaya.Object.extend({
  initialize: function() {
    var that = this;
    this.ready = false;
    this.on("ready", function() {
      that.ready = true;
    })
  },
  load: function() {}
});

Kaya.Resource.Image = Kaya.Resource.extend({
  load: function() {
    var that = this;
    this.image = new Image();
    this.image.onload = function() {
      that.trigger("ready");
    };
    this.image.src = this.src;
  }
});

Kaya.ResourceLoader = Kaya.Object.extend({
  initialize: function() {
    var that = this;

    if (!this.list) {
      throw new Error("No resource list specified.");
    }
    this.size = this.list.length;

    this.progress = 0;
  },

  load: function() {
    var that = this;
    this.list.forEach(function(resource){
      resource.on("ready", function() {
        that.progress += 1;
        that.trigger("progress", that.progress, that.size);
        if (that.progress === that.size) {
          that.trigger("ready");
        }
      });
      resource.load();
    });
  }
});
Kaya.App = Kaya.Object.extend({
  initialize: function() {
    // Read documentObject
    if (!this.documentObject) {
      throw new Error('No app frame is specified.');
    }

    // Create _DOM object
    this._DOM = document.querySelector(this.documentObject);
    if (this._DOM === null) {
      throw new Error('App document object is not found.');
    }

    // Give default value for size.
    this.size = this.size || {};
    this.size.width = this.size.width || 400;
    this.size.height = this.size.height || 300;
    this._DOM.style.backgroundColor = this.background || '#000000';
    this._DOM.style.width = this.size.width + 'px';
    this._DOM.style.height = this.size.height + 'px';

    this._canvas = document.createElement('canvas');
    this._canvas.width  = this.size.width;
    this._canvas.height = this.size.height;
    this._DOM.appendChild(this._canvas);
    this._context = this._canvas.getContext('2d');

    // Do refresh
    var that = this;
    var lastRefresh = new Date().getTime();
    var refresh = function() {
      var currentTime = new Date().getTime();
      var delta = currentTime - lastRefresh;
      lastRefresh = currentTime;
      that.trigger("refresh", delta);
      window.requestAnimationFrame(refresh, that._DOM);
    };
    refresh();

    // Display FPS
    if (Kaya.debug) {
      var fpsObject = document.querySelector("#fps");
      var updateFPS = function(delta) {
        fpsObject.innerHTML = Math.round(1000 / delta);
      };
      this.on("refresh", updateFPS);
    }
  },

  runStage: function(stage) {
    if (this._currentStage) {
      stage.trigger("leave");
    }
    this._currentStage = stage;
    stage._app = this;
    stage.trigger("enter");
  }
});
Kaya.Stage = Kaya.Object.extend({
  initialize: function() {
    var that = this;

    // Create empty sprite list.
    this.sprites = this.sprites || [];

    var refresh = function(delta) {
      // Clear _context
      that._app._context.clearRect(0, 0, that._app.size.width, that._app.size.width);

      // Render _context
      that.sprites.forEach(function(sprite) {
        sprite.renderWrapper(that._app._context, that._app.size.width, that._app.size.height);
      });

    };

    // Enter and leave stage.
    var onEnter = function() {
      that._app.on("refresh", refresh);
    };
    this.on("enter", onEnter);
    var onLeave = function() {
      that._app.off("refresh", refresh);
    };
    this.on("leave", onLeave);
  }
});
Kaya.Sprite = Kaya.Object.extend({
  renderWrapper: function(context, width, height) {
    if (this.lazyRender) {
      if (this.rerender || !this._lazyRenderCanvas) {
        this.translateAndRender(this.lazyRenderContext(width, height));
        this.rerender = false;
      } else {
        context.drawImage(this._lazyRenderCanvas, 0, 0);
      }
    } else {
      this.translateAndRender(context);
    }
  },

  translateAndRender: function(context) {
    // Save the context drawing center.
    context.save();
    // Move the drawing center.
    if (this.x || this.y) {
      context.translate(this.x || 0, this.y || 0);
    }
    // Rotate the canvas.
    if (this.rotate) {
      context.rotate(this.rotate);
    }
    // Set alpha.
    if (this.alpha) {
      context.globalAlpha = this.alpha;
    }
    // Do render
    this.render(context);
    // Restore context
    context.restore();
  },

  lazyRenderContext: function(width, height) {
    if (!this._lazyRenderCanvas) {
      this._lazyRenderCanvas = document.createElement('canvas');
      this._lazyRenderCanvas.width  = width;
      this._lazyRenderCanvas.height = height;
    }
    return this._lazyRenderCanvas.getContext('2d');
  },

  render: function(context) {
  },

  above: function(x, y) {
    return Math.abs(x) * 2 <= this.width
        && Math.abs(y) * 2 <= this.height;
  },

  aboveOnCanvas: function(x, y) {

  }
});


Kaya.Sprite.Rectangle = Kaya.Sprite.extend({
  render: function(context) {
    context.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    context.fillRect(- this.width/2, - this.height/2, this.width, this.width);
  }
});

Kaya.Sprite.Image = Kaya.Sprite.extend({
  render: function(context) {
    context.drawImage(this.image.image, - this.width/2, - this.height/2, this.width, this.height);
  }
});

Kaya.Sprite.SpriteSheet = Kaya.Sprite.extend({
  render: function(context) {
    context.drawImage(this.image.image, - this.width/2, - this.height/2, this.width, this.height);
  }
});
Kaya.Action = Kaya.Object.extend({
  initialize: function() {
    // Nothing here?
  },

  update: function(delta) { },

  start: function() {
    this._updateFunction = this.update.bind(this);
    this.app.on("refresh", this._updateFunction);
  },

  pause: function() {
    this.app.off("refresh", this._updateFunction);
  }
});

Kaya.Action.FiniteTime = Kaya.Action.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    if (!this.duration) {
      throw new Error("Duration is not defined for a finite action.");
    }
    this._passTime = 0;
  },

  start: function() {
    var that = this;
    this._updateFunction = (function(delta) {
      that._passTime += delta;
      var progress = that._passTime / that.duration;
      if (progress >= 1) {
        progress = 1;
        that.trigger("finish");
        that.app.off("refresh", that._updateFunction);
      }
      that.update(progress);
    }).bind(this);
    this.app.on("refresh", this._updateFunction);
  }
});

Kaya.Action.LinearGradient = Kaya.Action.FiniteTime.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    if (!this.sprite) {
      throw new Error("Sprite is not defined");
    }
  },
  update: function(progress) {
    for (var prop in this.list) {
      this.sprite[prop] = this.list[prop].from + this.list[prop].distance * progress;
    }
  }
});

Kaya.Action.Move = Kaya.Action.LinearGradient.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this.list = {
      x: {
        from: this.sprite.x,
        distance: this.x
      },
      y: {
        from: this.sprite.y,
        distance: this.y
      }
    }
  }
});


Kaya.Action.Rotate = Kaya.Action.LinearGradient.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this.list = {
      rotate: {
        from: this.sprite.rotate || 0,
        distance: this.rotate
      }
    }
  }
});

Kaya.Action.Loop = Kaya.Action.extend({
  initialize: function() {
    this._super.apply(this, this.arguments);
    this.count = 0;
    this.startAction();
    if (!this.action) {
      throw new Error("Action is not defined");
    }
    this.app = this.action.app;
  },

  startAction: function() {
    var that = this;
    var tempAction = new this.action;
    tempAction.on("finish", function() {
      that.count += 1;
      console.log("here?" + that.count)
      if (that.times === -1 || that.count < that.times) {
        // that.startAction();
        // Can this prevent recursive?
        console.log("here?");
        setTimeout(that.startAction.bind(that), 0);
      }
    });
    tempAction.start();
  }

});
