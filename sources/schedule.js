Kaya.Schedule = Kaya.Class.extend({
  constructor: function(self, interval, handler){
    this._id = Kaya.uniqueId();
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
  }
});

ScheduleMethods = {
  setSchedule: function(interval, handler) {
    this._schedule = this._schedule || [];
    this._schedule.push(new Kaya.Schedule(this, interval, handler));
  }
};