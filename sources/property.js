/*
 * Property
 */

// Get the value of a property.
Kaya.Class.prototype.get = function(name) {
  if (this._properties) {
    if (name) {
      return this._properties[name] || undefined;
    } else {
      return Kaya.utilities.clone(this._properties);
    }
  } else {
    return undefined;
  }
};

// Change the property(s).
Kaya.Class.prototype.set = function() {
  var changes, silent = false;
  if (arguments[0] && typeof arguments[0] === 'string' && arguments[1]) {
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
  for (var name in changes) {
    if (this.get(name) === 'undefined'
      || this.get(name) !== changes[name]) {
      // Add or change a property
      this._previous[name] = this._properties[name];
      this._properties[name] = changes[name];
    }
  }
  if (!silent) {
    this.trigger('change');
  }
  this._changes = changes;
  return this;
};

// Delete a property.
Kaya.Class.prototype.unset = function(name, silent) {
  if (this._properties && this._properties[name]) {
    this._previous[name] = this._properties[name];
    delete this._properties[name];
    if (!silent) {
      this.trigger('change');
      this._changes = [].push(name);
    }
  }
  return this;
};

// Get the previous value of a property.
// If name is not specified, return the array of all previous properties.
Kaya.Class.prototype.previous = function(name) {
  if (this._previous) {
    if (name) {
      return this._previous[name] || undefined;
    } else {
      return Kaya.utilities.clone(this._previous);
    }
  } else {
    return undefined;
  }
};

// Return whether a property has changed.
Kaya.Class.prototype.hasChanged = function(name) {
  return this._changes && typeof this._changes[name] !== 'undefined';
};

Kaya.Class.prototype.changes = function() {
  return Kaya.utilities.clone(this._changes);
};