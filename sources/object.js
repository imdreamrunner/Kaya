Kaya.Object = Kaya.Class.extend({
  constructor: function(prop) {
    // Prepare for event
    this.events = [];

    // Override properties
    for (var m in prop) {
      this[m] = prop[m];
    }

    // Call beforeInitialize
    if (this.beforeInitialize) {
      this.beforeInitialize();
    }

    // Run initialize
    if (this.initialize) {
      this.initialize();
    }

    // Call afterInitialize
    if (this.afterInitialize) {
      this.afterInitialize();
    }
  },

  on: function(event, listener) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(listener);
  },

  off: function(event, listener) {
    if (this.events[event]) {
      this.events[event].remove(listener);
    }
  },

  trigger: function() {
    var argumentList = Array.prototype.slice.call(arguments);
    argumentList.splice(0, 1);
    var listeners = this.events[arguments[0]];
    if (!listeners) return;
    listeners.forEach(function (listener) {
      listener.apply(this, argumentList);
    });
  }

});