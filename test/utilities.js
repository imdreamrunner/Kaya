module('Utilities');

test('.hexToRgb()', function() {
  expect(3);
  ok(Kaya.Utilities.hexToRgb('#EEE').r === 238);
  ok(Kaya.Utilities.hexToRgb('#123456').b === 86);
  ok(Kaya.Utilities.hexToRgb('123456').g === 52);
});