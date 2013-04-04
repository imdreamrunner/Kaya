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
    console.log('action finished');
    if (this.callback) {
      this.callback.call(this.sprite);
    }
    this.removeSchedule();
    this.sprite.finishAction(this);
  }
});

Kaya.Action.Move = Kaya.Action.extend({
  constructor: function(options) {
    this._super(options);
    if (options.target) {
      if (typeof options.target.x !== 'undefined' && typeof options.target.y !== 'undefined') {
        this.target = options.target;
      }
    }
  },

  // Overwrite the default run method.
  run: function(sprite){
    // Remember to call the origin method.
    this._super.apply(this, arguments);
    // Decide the speed by checking it direction.
    this.speedX = sprite.get('x') < this.target.x ? 1 : -1;
    this.speedY = sprite.get('y') < this.target.y ? 1 : -1;
    this.setSchedule(1, this.updater);
  },

  updater: function() {
    var sprite = this.sprite;
    var finish = 0;
    if (sprite.get('x') === this.target.x) {
      finish++;
    } else {
      sprite.set('x', sprite.get('x') + this.speedX);
    }
    if (sprite.get('y') === this.target.y) {
      finish++;
    } else {
      sprite.set('y', sprite.get('y') + this.speedY);
    }
    if (finish === 2) {
      this._finish();
    }
  }
});

Kaya.Action.MoveTo = Kaya.Action.Move.extend({
  constructor: function(x, y) {
    var options = {target: {x: x, y: y}};
    this._super(options);
  }
});

Kaya.Utilities.extend(Kaya.Action.prototype, ScheduleMethods);