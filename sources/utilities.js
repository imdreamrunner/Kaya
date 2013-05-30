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
      for (t2 = x, i = 0; i < 8; i++){
        x2 = curveX(t2) - x;
        if (Math.abs(x2) < epsilon) return curveY(t2);
        d2 = derivativeCurveX(t2);
        if (Math.abs(d2) < 1e-6) break;
        t2 = t2 - x2 / d2;
      }

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
      console.log('Failure!');
      return curveY(t2);

    };

  }
};