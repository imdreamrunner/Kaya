Kaya.Action.Remove = Kaya.Action.extend({
  run: function(sprite) {
    sprite.remove();
    this._finish();
  }
});