Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, interval, handler){
    this.self = self;
    this.interval = interval;
    this.handler = handler;
    this._next = interval;
  },

  refresh: function() {
    if (!this._next) {
      this.handler.call(self, this);
      this._next = this.interval;
    }
    this._next--;
  },

  remove: function() {
    this.self.removeSchedule(this._id);
  }
});

ScheduleMethods = {
  setSchedule: function(interval, handler) {
    this._schedules = this._schedules || [];
    this._schedules.push(new Kaya.Schedule(this, interval, handler));
  },

  removeSchedule: function(scheduleId) {
    for (var i in this._schedules) {
      if (this._schedules[i]._id === scheduleId) {
        this._schedules.splice(i, 1);
        return;
      }
    }
    throw new Error('Unable to remove schedule: id not exist.')
  }
};