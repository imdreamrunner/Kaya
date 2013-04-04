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
    this._next--;
  },

  remove: function() {
    this.self.removeSchedule(this);
  }
});

ScheduleMethods = {
  setSchedule: function(interval, handler) {
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