Kaya.Stage = Kaya.Object.extend({
  initialize: function() {
    var that = this;

    // Create empty sprite list.
    this.sprites = this.sprites || [];

    var refresh = function(delta) {
      // Clear _context
      that._app._context.clearRect(0, 0, that._app.size.width, that._app.size.width);

      // Render _context
      that.sprites.forEach(function(sprite) {
        sprite.renderWrapper(that._app._context, that._app.size.width, that._app.size.height);
      });

    };

    // Enter and leave stage.
    var onEnter = function() {
      that._app.on("refresh", refresh);
    };
    this.on("enter", onEnter);
    var onLeave = function() {
      that._app.off("refresh", refresh);
    };
    this.on("leave", onLeave);
  }
});