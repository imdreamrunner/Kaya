module('Core');

test('load', function () {
  expect(1);
  ok(Kaya, 'loaded');
});

test('.extend()', function () {
  expect(5);
  var Parent = Kaya.Class.extend({
    initialize: function(value) {
      this.value = value;
    },
    testValue: 2,
    testMethod: function(value) {
      if (value) {
        ok(true, 'super method');
      } else {
        ok(true, 'parent method');
      }
    }
  });
  var parent = new Parent(1);
  ok(parent.testValue === 2, 'property');
  ok(parent.value === 1, 'initialize');
  parent.testMethod(false);
  var Son = Parent.extend({
    testMethod: function() {
      this._super(true);
      ok(true, 'son method');
    }
  });
  var son = new Son();
  son.testMethod();
});