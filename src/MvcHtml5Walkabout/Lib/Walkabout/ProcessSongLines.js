(function() {
  var file, filenames, fs, index, output, path, source, _fn, _len;

  fs = require('fs');

  path = require('path');

  source = '../..';

  output = 'songlines.js';

  filenames = fs.readdirSync("" + source);

  _fn = function(file, index) {
    var fileContents;
    fileContents = fs.readFileSync("" + source + "/" + file, 'utf8');
    return console.log(JSON.stringify(file));
  };
  for (index = 0, _len = filenames.length; index < _len; index++) {
    file = filenames[index];
    _fn(file, index);
  }

  fs.writeFileSync(output, JSON.stringify(filenames));

}).call(this);
