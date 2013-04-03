Kaya.Sprite = Kaya.Object.extend({
  schedule: [],

  render: function() {},

  constructor: function(properties) {
    this.set(properties);

    this.on('refresh', this.refresh);
    this.on('change', this.render);

    // Clone the schedule for counting.
    // this._schedule = Kaya.Utilities.clone(this.schedule);
  },

  run: function(parent) {
    this.parent = parent;
    this.app = parent.app;
    this.createDOM();
    if (this.initialize) {
      this.initialize.call(this);
    }
    this.render();
  },

  createDOM: function() {
    if (this.parent && this.parent.$DOM) {
      if (!this.$DOM) {
        this.$DOM = $('<canvas width="' + this.app.size.width + '" height="' +  this.app.size.height + '">');
        this.$DOM.css({
          position: 'absolute'
        });
        this.parent.$DOM.append(this.$DOM);
        this.context = this.$DOM[0].getContext('2d');
      }
    } else {
      throw new Error('Unable to create DOM');
    }
  },

  refresh: function() {
    this._schedule.forEach(function(schedule) {
      if (!schedule.next) {
        schedule.next = schedule.interval;
        schedule.callback.call(this);
      }
      schedule.next--;
    }, this);
  },

  remove: function() {
    if (this.parent) {
      this.parent.detach(this._id);
    }
    this.off();
    this.stopListening();
    console.log('sprite is removed.');
  }
});