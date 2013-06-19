function isMatch(a, b) {
  if (a.get('type') !== b.get('type')) {
    return false;
  }
  var layer = a.layer;
  function hasBrick(x, y) {
    var bricks = layer.where({
      left: x,
      top: y,
      exploded: false
    });
    return !!bricks.length;
  }
  var ax = a.get('left');
  var ay = a.get('top');
  var bx = b.get('left');
  var by = b.get('top');
  var t;
  if (ax > bx) {
    t = bx;
    bx = ax;
    ax = t;
    t = by;
    by = ay;
    ay = t;
  }

  function findMax(startX, startY, direction) {
    var vertical = direction === 0 || direction === 2;
    var step = (direction === 1 || direction === 2) ? 1 : -1;
    var target = vertical ? startY : startX;
    while (true) {
      target += step;
      if (target < 0) {
        return -1;
      }
      if (vertical) {
        if (target > (HEIGHT - 1)) {
          return HEIGHT
        }
        if (hasBrick(startX, target)) {
          return target - step;
        }
      } else {
        if (target > (WIDTH - 1)) {
          return WIDTH;
        }
        if (hasBrick(target, startY)) {
          return target - step;
        }
      }
    }
  }

  // Z style

  var ax_min = findMax(ax, ay, 3),
    ax_max = findMax(ax, ay, 1),
    bx_min = findMax(bx, by, 3),
    bx_max = findMax(bx, by, 1);

  var left = Math.max(ax_min, bx_min),
    right = Math.min(ax_max, bx_max);
  if (left <= right) {
    for (var tx = left; tx <= right; tx++) {
      if (ay < by) {
        if (findMax(tx, ay, 2) >= (by - 1)) {
          return true;
        }
      } else {
        if (findMax(tx, ay, 0) <= (by + 1)) {
          return true;
        }
      }
    }
  }

  // S style
  var ay_min = findMax(ax, ay, 0),
    ay_max = findMax(ax, ay, 2),
    by_min = findMax(bx, by, 0),
    by_max = findMax(bx, by, 2);

  var top = Math.max(ay_min, by_min),
    bottom = Math.min(ay_max, by_max);
  if (top <= bottom) {
    for (var ty = top; ty <= bottom; ty++) {
      if (ax < bx) {
        if (findMax(ax, ty, 1) >= (bx - 1)) {
          return true;
        }
      } else {
        if (findMax(ax, ty, 3) <= (bx + 1)) {
          return true;
        }
      }
    }
  }

  return false;
}

function findPath(a, b) {
  var layer = a.layer;
  function hasBrick(x, y) {
    var bricks = layer.where({
      left: x,
      top: y,
      exploded: false
    });
    return !!bricks.length;
  }
  var ax = a.get('left');
  var ay = a.get('top');
  var bx = b.get('left');
  var by = b.get('top');
  var t;
  if (ax > bx) {
    t = bx;
    bx = ax;
    ax = t;
    t = by;
    by = ay;
    ay = t;
  }

  function findMax(startX, startY, direction) {
    var vertical = direction === 0 || direction === 2;
    var step = (direction === 1 || direction === 2) ? 1 : -1;
    var target = vertical ? startY : startX;
    while (true) {
      target += step;
      if (target < 0) {
        return -1;
      }
      if (vertical) {
        if (target > (HEIGHT - 1)) {
          return HEIGHT
        }
        if (hasBrick(startX, target)) {
          return target - step;
        }
      } else {
        if (target > (WIDTH - 1)) {
          return WIDTH;
        }
        if (hasBrick(target, startY)) {
          return target - step;
        }
      }
    }
  }

  // Z style

  var ax_min = findMax(ax, ay, 3),
    ax_max = findMax(ax, ay, 1),
    bx_min = findMax(bx, by, 3),
    bx_max = findMax(bx, by, 1);

  var left = Math.max(ax_min, bx_min),
    right = Math.min(ax_max, bx_max);
  if (left <= right) {
    for (var tx = left; tx <= right; tx++) {
      if (ay < by) {
        if (findMax(tx, ay, 2) >= (by - 1)) {
          return {
            type: 0,
            x: tx
          };
        }
      } else {
        if (findMax(tx, ay, 0) <= (by + 1)) {
          return {
            type: 0,
            x: tx
          };
        }
      }
    }
  }

  // S style
  var ay_min = findMax(ax, ay, 0),
    ay_max = findMax(ax, ay, 2),
    by_min = findMax(bx, by, 0),
    by_max = findMax(bx, by, 2);

  var top = Math.max(ay_min, by_min),
    bottom = Math.min(ay_max, by_max);
  if (top <= bottom) {
    for (var ty = top; ty <= bottom; ty++) {
      if (ax < bx) {
        if (findMax(ax, ty, 1) >= (bx - 1)) {
          return {
            type: 1,
            y: ty
          };
        }
      } else {
        if (findMax(ax, ty, 3) <= (bx + 1)) {
          return {
            type: 1,
            y: ty
          };
        }
      }
    }
  }

  return false;
}


function drawFire(a, b) {
  var newFires = [];

  var layer = a.layer;
  var ax = a.get('left');
  var ay = a.get('top');
  var bx = b.get('left');
  var by = b.get('top');
  var stepX, stepY;
  var path = findPath(a, b);
  if (path.type === 0) {
    stepX = ax < path.x ? 1 : -1;
    for (var i = ax; i !== path.x; i += stepX) {
      newFires.push(new Fire({
        top: ay,
        left: i
      }));
    }
    stepY = ay < by ? 1 : -1;
    for (var i = ay; i !== by; i += stepY) {
      newFires.push(new Fire({
        top: i,
        left: path.x
      }));
    }
    stepX = path.x < bx ? 1 : -1;
    for (var i = path.x; i !== bx; i += stepX) {
      newFires.push(new Fire({
        top: by,
        left: i
      }));
    }
    newFires.push(new Fire({
      top: by,
      left: bx
    }));
  } else {
    stepY = ay < path.y ? 1 : -1;
    for (var i = ay; i !== path.y; i += stepY) {
      newFires.push(new Fire({
        top: i,
        left: ax
      }));
    }
    stepX = ax < bx ? 1 : -1;
    for (var i = ax; i !== bx; i += stepX) {
      newFires.push(new Fire({
        top: path.y,
        left: i
      }));
    }
    stepY = path.y < by ? 1 : -1;
    for (var i = path.y; i !== by; i += stepY) {
      newFires.push(new Fire({
        top: i,
        left: bx
      }));
    }
    newFires.push(new Fire({
      top: by,
      left: bx
    }));
  }
  newFires.forEach(function(sprite) {
    fireLayer.attach(sprite);
    sprite.runAction(new Kaya.Action.Queue([
      new Kaya.Action.FadeOut(1000),
      new Kaya.Action.Remove()
    ]));
  });
}

function findMatch(layer) {
  var bricks = layer.where({exploded: false});
  var total = bricks.length;
  var random = Math.floor(Math.random() * total);
  for (var i = 0; i < total; i++) {
    var temp = (i + random) % total;
    for (var j = temp + 1; j < total; j++) {
      if (isMatch(bricks[temp], bricks[j])) {
        return [bricks[temp], bricks[j]];
      }
    }
  }
  return [];
}