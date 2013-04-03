module('Event');

test('.on(), .trigger()', function () {
  expect(2);
  var Class = Kaya.Class.extend();
  var instance = new Class;
  var handler = function(event) {
    ok(true, event.name + ' trigger event.');
  }
  var handler2 = function(event) {
    ok(true, event.name + ' trigger another event.');
  }
  instance.on('something', handler);
  instance.on('something', handler2);
  instance.trigger('something');
});

test('.off()', function () {
  expect(2);
  var Class = Kaya.Class.extend();
  var instance = new Class;
  var handler = function(event) {
    ok(true, event.name + ' trigger event.');
  }
  var handler2 = function(event) {
    ok(true, event.name + ' trigger another event.');
  }
  instance.on('something', handler);
  instance.on('other', handler);
  instance.on('something', handler2);
  instance.off('something', handler2);
  instance.trigger('something');
  instance.trigger('other');
  instance.off('other');
  instance.trigger('other');
  instance.off();
  instance.trigger('something');
});

test('.listenTo()', function () {
  expect(1);
  var SomeClass = Kaya.Class.extend({
    doA: function() {
      this.trigger('A');
    }
  });
  var listening = new SomeClass();
  var listener = new SomeClass();
  var handler = function() {
    ok(true, 'event fires.');
  }
  listener.listenTo(listening, 'A', handler);
  listening.doA();
});

test('.stopListening()', function () {
  expect(4);
  var SomeClass = Kaya.Class.extend({
    doABC: function() {
      this.trigger('A').trigger('B').trigger('C');
    }
  });
  var listening = new SomeClass();
  var listener = new SomeClass();
  var handler = function(event) {
    ok(true,event.name + ' event fires.')
  }
  listener.listenTo(listening, 'A', handler);
  listener.listenTo(listening, 'B', handler);
  listening.doABC();
  listener.stopListening(listening, 'B');
  listening.doABC();
  var handler2 = function(event) {
    ok(true, event.name + ' event fires again.')
  }
  listener.listenTo(listening, 'B', handler2);
  listener.stopListening(handler);
  listening.doABC();
});

test('.once(), .listenToOnce', function () {
  expect(2);
  var Class = Kaya.Class.extend();
  var instance = new Class;
  var instance2 = new Class;
  var handler = function(event) {
    ok(true, event.name + ' trigger event.');
  }
  instance.once('something', handler);
  instance2.listenToOnce(instance,'something', handler);
  instance.trigger('something');
  instance.trigger('something');
});