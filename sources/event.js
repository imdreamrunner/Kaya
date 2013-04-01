/*
 * Event Class
 * Inspired by Backbone.js
 */


Kaya.Event = function(self, target, name, handler) {
  this._id = Kaya.uniqueId();
  this.self = self;
  this.target = target;
  this.name = name;
  this.handler = handler;
  target.addListener(this);
  self.addListening(this);
};

Kaya.Event.prototype = {
  trigger: function() {
    this.handler.apply(this, arguments);
  },
  remove: function() {
    this.self.removeListening(this._id);
    this.target.removeListener(this._id);
  }
};

/*
 * Add event methods to Class prototype.
 */

// Add an event to event list.
Kaya.Class.prototype.addListener = function(event) {
  this._events = this._events || [];
  this._events.push(event);
};

// Remove an event from event list.
Kaya.Class.prototype.removeListener = function(id) {
  if (this._events) {
    for (var i in this._events) {
      if (this._events[i]._id === id) {
        this._events.splice(i, 1);
        return;
      }
    }
  }
  throw new Error('Event not found when trying to remove it.');
};

// Add an event to listening list.
Kaya.Class.prototype.addListening = function(event) {
  this._listening = this._listening || [];
  this._listening.push(event);
};

// Remove an event from listening list.
Kaya.Class.prototype.removeListening = function(id) {
  if (this._listening) {
    for (var i in this._listening) {
      if (this._listening[i]._id === id) {
        this._listening.splice(i, 1);
        return;
      }
    }
  }
  throw new Error('Event not found when trying to remove it.');
};

// Listen to a self event.
Kaya.Class.prototype.on = function(name, handler) {
  new Kaya.Event(this, this, name, handler);
  return this;
};

// Add an event handler that will trigger only once.
Kaya.Class.prototype.once = function(name, handler) {
  var onceHandler = function() {
    handler.apply(this, arguments);
    this.remove();
  }
  this.on(name, onceHandler);
  return this;
};

// Remove event handler from self.
Kaya.Class.prototype.off = function() {
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
};

// Listen to an event of another object.
Kaya.Class.prototype.listenTo = function(target, name, handler) {
  new Kaya.Event(this, target, name, handler);
  return this;
};

// Listen to an event of another object once.
Kaya.Class.prototype.listenToOnce = function(target, name, handler) {
  var onceHandler = function() {
    handler.apply(this, arguments);
    this.remove();
  }
  this.listenTo(target, name, onceHandler);
  return this;
};

// Stop listening to event(s) from other objects.
Kaya.Class.prototype.stopListening = function() {
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
};

// Trigger an event.
Kaya.Class.prototype.trigger = function(name) {
  if (this._events) {
    for (var i in this._events) {
      if (this._events[i].name === name) {
        this._events[i].trigger();
      }
    }
  }
  return this;
};