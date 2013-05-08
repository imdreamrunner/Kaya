Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, handler, interval){
    this.self = self;
    this.interval = interval;
    this.handler = handler;
    this.timer = 0;
  },

  refresh: function(delta) {
    this.timer += delta;
    if (this.timer >= this.interval) {
      this.handler.call(this.self, this, delta);
      if (this.interval) {
        while (this.timer >= this.interval) {
          this.timer -= this.interval;
        }
      } else {
        this.timer = 0;
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