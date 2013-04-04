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

  trigger: function() {
    var argumentList = Array.prototype.slice.call(arguments);
    argumentList.push(this)
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
    if (this._events) {
      for (var i in this._events) {
        if (this._events[i].name === name) {
          this._events[i].trigger();
        }
      }
    }
    return this;
  }
};