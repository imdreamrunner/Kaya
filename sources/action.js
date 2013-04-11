/*
 * Class Action.
 */

Kaya.Action = Kaya.Class.extend({
  constructor: function(options) {
    this._running = false;
  },

  run: function(sprite, callback) {
    this.sprite = sprite;
    if (callback) {
      this.callback = callback;
    }
    this._running = true;
  },

  refresh: function() {
    if (this._running && this._schedules){
      this._schedules.forEach(function(schedule) {
        schedule.refresh();
      }, this);
    }
  },

  // Remove itself from sprite when it is finished.
  _finish: function() {
    if (this.callback) {
      this.callback.call(this.sprite);
    }
    this.removeSchedule();
    this.sprite.finishAction(this);
  }
});

Kaya.Utilities.extend(Kaya.Action.prototype, ScheduleMethods);