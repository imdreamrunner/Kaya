Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, interval, handler){
    this.self = self;
    this.interval = interval;
    this.handler = handler;
    this._next = interval;
  },

  refresh: function() {
    if (!this._next) {
      this.handler.call(this.self, this);
      this._next = this.interval;
    }
    this._next --;
  },

  remove: function() {
    this.self.removeSchedule(this);
  }
});

ScheduleMethods = {
  setSchedule: function(interval, handler, intervalInSecond) {
    if (typeof interval !== 'number') {
      // set interval by time.
      intervalInSecond = handler;
      handler = interval;

      // get fps
      var fps;
      if (this.sprite && this.sprite.app) {
        // get fps from action.
        fps = this.sprite.app.fps;
      } else if (this.app) {
        // get fps from sprite.
        fps = this.app.fps;
      }
      if (!fps) {
        throw new Error('Fps is not defined.');
      }

      interval = intervalInSecond * fps;
    }
    this._schedules = this._schedules || [];
    this._schedules.push(new Kaya.Schedule(this, interval, handler));
  },

  removeSchedule: function(schedule) {
    if (schedule) {
      var index = this._schedules.indexOf(schedule);
      if (index > -1) {
        this._schedules.splice(index, 1);
      } else {
        throw new Error('Unable to remove schedule: id not exist.');
      }
    } else {
      // Remove all schedules.
      this._schedules.length = 0;
    }
  }
};