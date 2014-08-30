Kaya.Stage = Kaya.Object.extend({
  initialize: function() {
    var that = this;

    // Create empty sprite list.
    this._sprites = [];
    this._spriteLayer = {};

    var refresh = function(delta) {
      // Clear _context
      that._app._context.clearRect(0, 0, that._app.size.width, that._app.size.width);

      // Render _context
      that._sprites.forEach(function(sprite) {
        sprite.renderWrapper();
      });

    };

    // Enter and leave stage.
    var onEnter = function() {
      that.updateSpriteList();
      that._app.on("refresh", refresh);
    };
    this.on("enter", onEnter);
    var onLeave = function() {
      that._app.off("refresh", refresh);
    };
    this.on("leave", onLeave);
  },

  updateSpriteList: function() {
    this._sprites = [];
    for (var i in this._spriteLayer) {
      var sprites = this._spriteLayer[i];
      if (sprites.length === 0) continue;
      for (var newSprite in sprites) {
        sprites[newSprite]._app = this._app;
        this._sprites.push(sprites[newSprite]);
      }
    }
  },

  addSprite: function(sprite, layer) {
    this._spriteLayer[layer] = this._spriteLayer[layer] || [];
    this._spriteLayer[layer].push(sprite);
    this.updateSpriteList();
  },

  removeSprite: function(sprite) {
    for (var i in this._spriteLayer) {
      var sprites = this._spriteLayer[i];
      while(sprites.indexOf(sprite) >= 0) {
        var found = sprites.indexOf(sprite);
        sprites.splice(found, 1);
      }
    }
    this.updateSpriteList();
  },

  rearrangeSprite: function(sprite, layer) {
    this.removeSprite(sprite);
    this.addSprite(sprite, layer);
  }
});
