/*
 * Kaya HTML5 Game Engine.
 * Author: Ivor, ZHOU Xinzi
 */

var Kaya = window.Kaya = function() {};

Kaya.version = '0.0.1';

Kaya.debug = true;


var uniqueIdNumber = 0;
/*
 * Generate a unique id, which can be use everywhere you like.
 */
Kaya.uniqueId = function() {
  return ++uniqueIdNumber;
};
