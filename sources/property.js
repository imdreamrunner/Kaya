/*
 * Property
 */


Kaya.Class.prototype.get = function(name) {
  if (!this._properties) {
    return undefined;
  }
  if (typeof this._properties[name] === 'undefined'){
    return undefined;
  }
  return this._properties[name];
};

Kaya.Class.prototype.set = function() {
  var properties;
  if (arguments[0] && typeof arguments[0] === 'string' && arguments[1]) {
    properties = {};
    properties[arguments[0]] = arguments[1];
  } else if (typeof arguments[0] === 'object') {
    properties = arguments[0];
  }
  this._properties = this._properties || {};
  for (var name in properties) {
    if (this.get(name) === 'undefined'
      || this.get(name) !== properties[name]) {
      // Add or change a property
      this._properties[name] = properties[name];
    }
  }
};