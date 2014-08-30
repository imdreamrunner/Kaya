/*
 * Build script from https://github.com/posabsolute/small-build-script-with-node
 */

/* You need uglify
 // npm install -g uglify-js
 // npm link uglify-js
 // Run that into node and voila
 */


var FILE_ENCODING = 'utf-8',

  EOL = '\n';

var _fs = require('fs');
var config = require('./config');

function concat(opts) {

  var fileList = opts.src;
  var distPath = opts.dest;
  var out = fileList.map(function(filePath){
    return _fs.readFileSync(filePath, FILE_ENCODING);
  });

  _fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
  console.log(' '+ distPath +' built.');
}

concat({
  src : config.fileList,
  dest : 'kaya.js'
});

function uglify(srcPath, distPath) {
  var
    uglyfyJS = require('uglify-js'),
    result = uglyfyJS.minify(srcPath);

  _fs.writeFileSync(distPath, result.code, FILE_ENCODING);
  console.log(' '+ distPath +' built.');
}

uglify('kaya.js', 'kaya.min.js');

console.log("and you're done");
process.exit(1);