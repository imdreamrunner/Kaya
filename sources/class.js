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
    if (!initializingClass && this.initialize) {
      this.initialize.apply(this, arguments);
    }
  }

  // Populate our constructed prototype object
  Class.prototype = prototype;

  // Enforce the constructor to be what we expect
  Class.prototype.constructor = Class;

  Class.extend = Kaya.Class.extend;
  Class.join = Kaya.Class.join;

  return Class;
};