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
      this._events[event].remove(listener);
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