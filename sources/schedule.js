Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, handler, interval){
    this.self = self;
    this.interval = interval;
    this.handler = handler;
    this._next = interval;
  },

  refresh: function(delta) {
    this._next -= delta;

    if (this._next <= 0) {
      this.handler.call(this.self, this);
      if (this.interval) {
        while (this._next < 0) {
          this._next += this.interval;
        }
      } else {
        this._next = 0;
      }
    }
  },

  remove: function() {
    this.self.removeSchedule(this);
  }
});

ScheduleMethods = {
  setSchedule: function(handler, interval) {
    this._schedules = this._schedules || [];
    this._schedules.push(new Kaya.Schedule(this, handler, interval));
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