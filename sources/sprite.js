/*
 * Class Sprite.
 */

Kaya.Sprite = Kaya.Object.extend({
  render: function() {},

  constructor: function(properties) {
    this.set(properties);

    this.on('refresh', this.refresh);
    this.on('change', this.render);
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
    if (this._schedules){
      this._schedules.forEach(function(schedule) {
        schedule.refresh();
      }, this);
    }
    if (this._actions) {
      this._actions.forEach(function(action) {
        action.refresh();
      }, this);
    }
  },

  runAction: function(action, callback) {
    this._actions = this._actions || [];
    this._actions.push(action);
    callback ? action.run(this, callback) : action.run(this);
    return this;
  },

  finishAction: function(action) {
    var index = this._actions.indexOf(action);
    if (index > -1) {
      this._actions.splice(index, 1);
    } else {
      throw new Error('Unable to remove finished action.');
    }
  },

  enqueueAction: function(action) {
    this._actionQueue = this._actionQueue || [];
    this._actionQueue.push(action);
    if (!this._queueing) {
      this._runQueueAction();
    }
    return this;
  },

  _runQueueAction: function() {
    if (this._actionQueue && this._actionQueue.length > 0) {
      this._queueing = true;
      this.runAction(this._actionQueue.shift(), this._runQueueAction);
    } else {
      this._queueing = false;
    }
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

Kaya.Utilities.extend(Kaya.Sprite.prototype, ScheduleMethods);