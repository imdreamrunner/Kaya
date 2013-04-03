module('Property');

test('.set(), .get()', function () {
  expect(4);
  var Class = Kaya.Class.extend();
  var instance = new Class();
  ok(instance.get('new') === undefined, 'undefined');
  instance.set('new', 100);
  ok(instance.get('new') === 100, 'set 1');
  instance.set({
    a: 1,
    b: 2
  });
  ok(instance.get('a') === 1, 'set 2');
  ok(instance.get('b') === 2, 'set 3');
});

test('.previous(), .hasChanged()', function () {
  expect(5);
  var Class = Kaya.Class.extend();
  var instance = new Class();
  instance.set('name', 'value');
  instance.set('name', 'newValue');
  ok(instance.previous('name') === 'value', 'previous value');
  instance.set('name', 'someValue');
  instance.set({
    1: 1,
    2: 2
  });
  instance.set({
    1: 10
  });
  var previousProperties = instance.previous();
  ok(previousProperties[1] === 1, 'value 1');
  ok(previousProperties['name'] === 'newValue', 'new value');
  ok(instance.hasChanged(1), 'has changed');
  ok(!instance.hasChanged(2), 'has not changed');
});

test('.unset()', function() {
  expect(2);
  var Class = Kaya.Class.extend();
  var instance = new Class();
  instance.set('a', 1);
  ok(instance.get('a'), 'set');
  instance.unset('a');
  ok(!instance.get('a'), 'unset')
});

test('"change" event', function () {
  expect(2);
  var Class = Kaya.Class.extend({
    constructor: function() {
      this.on('change', this.changeHandler);
    },
    changeHandler: function(event) {
      ok(true, event.name +' event fires.');
    }
  });
  var instance = new Class();
  instance.set('name', 'value');
  var Class2 = Class.extend({
    constructor: function() {
      this._super();
    }
  });
  var instance2 = new Class2();
  instance2.set('name2', 'value2');
  instance2.set({name: 'value'}, true);
});