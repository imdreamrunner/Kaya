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
  var fnTest = /\b_super\b/;
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