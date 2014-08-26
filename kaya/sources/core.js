/*
 * Kaya HTML5 Game Engine.
 * Author: Zhou Xinzi
 */

var Kaya = window.Kaya = function() {};

Kaya.version = '0.0.1';

Kaya.debug = 1;


var uniqueIdNumber = 0;
/*
 * Generate a unique id, which can be use everywhere you like.
 */
Kaya.uniqueId = function() {
  return ++uniqueIdNumber;
};
