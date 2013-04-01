module('Property');

test('.set(), .get()', function () {
  expect(4);
  var Class = Kaya.Class.extend();
  var instance = new Class;
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