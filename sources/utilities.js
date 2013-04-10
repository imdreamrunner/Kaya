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
  }
};