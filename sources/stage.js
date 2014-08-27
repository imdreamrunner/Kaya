Kaya.Stage = Kaya.Object.extend({
  afterInitialize: function() {
    var refresh = function() {

    };
    var onEnter = function() {
      this.app.on("refresh", refresh);
    };
    this.on("enter", onEnter);
    var onLeave = function() {
      this.app.off("refresh", refresh);
    }
    this.on("leave", onLeave);
  }
});