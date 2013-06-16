Kaya.Object = Kaya.Class.extend({
  /*
   * Methods for Properties.
   */

  // Get the value of a property.
  get: function(name) {
    if (this._properties) {
      if (name) {
        return typeof this._properties[name] === 'undefined' ? undefined : this._properties[name];
      } else {
        return Kaya.Utilities.clone(this._properties);
      }
    } else {
      return undefined;
    }
  },

  _checkDataType: function(property, value) {
    switch (this.dataTypes ? this.dataTypes[property] || '' : '') {
      case 'Integer':
        return parseInt(value);
      case 'Float':
        return parseFloat(value);
      case 'String' :
        return String(value);
      default:
        return value;
    }
  },

  // Change the property(s).
  // set(properties, isSilent) or set(property, value)
  set: function() {
    var changes, silent = false;
    if (typeof arguments[0] === 'string' && typeof arguments[1] !== 'undefined') {
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
    var changed = {}, isChanged = false;
    for (var name in changes) {
      if (changes.hasOwnProperty(name)) {
        changes[name] = this._checkDataType(name, changes[name]);
        if (this.get(name) === 'undefined'
          || this.get(name) !== changes[name]) {
          // Add or change a property
          this._previous[name] = this._properties[name];
          this._properties[name] = changes[name];
          changed[name] = changes[name];
          isChanged = true;
        }
      }
    }
    if (isChanged) {
      this._changes = changed;
      if (!silent) {
        this.trigger('change');
        for (var name in changed) {
          this.trigger('change:' + name);
        }
      }
    }
    return this;
  },

  // Delete a property.
  unset: function(name, silent) {
    if (this._properties && this._properties.hasOwnProperty(name)) {
      this._previous[name] = this._properties[name];
      delete this._properties[name];
      if (!silent) {
        this.trigger('change');
        this._changes = [].push(name);
      }
    }
    return this;
  },

  // Get the previous value of a property.
  // If name is not specified, return the array of all previous properties.
  previous: function(name) {
    if (this._previous) {
      if (name) {
        return this._previous[name] || undefined;
      } else {
        return Kaya.Utilities.clone(this._previous);
      }
    } else {
      return undefined;
    }
  },

  // Return whether a property has changed.
  hasChanged: function(name) {
    return this._changes && typeof this._changes[name] !== 'undefined';
  },

  changes: function() {
    return Kaya.Utilities.clone(this._changes);
  }
});

Kaya.Utilities.extend(Kaya.Object.prototype, EventMethods);