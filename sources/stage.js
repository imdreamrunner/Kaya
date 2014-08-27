Kaya.Stage = Kaya.Object.extend({
  beforeInitialize: function() {
    // Create empty sprite list.
    this.sprites = this.sprites || [];
  },

  afterInitialize: function() {
    var that = this;
    var refresh = function(delta) {
      // Update Sprite
      that.sprites.forEach(function(sprite) {
        sprite.trigger("update", delta);
      });

      // Clear context
      that.app.context.clearRect(0, 0, that.app.size.width, that.app.size.width);

      // Render context
      that.sprites.forEach(function(sprite) {
        sprite.renderWrapper(that.app.context, that.app.size.width, that.app.size.height);
      });

    };

    // Enter and leave stage.
    var onEnter = function() {
      that.app.on("refresh", refresh);
    };
    this.on("enter", onEnter);
    var onLeave = function() {
      that.app.off("refresh", refresh);
    };
    this.on("leave", onLeave);
  }
});