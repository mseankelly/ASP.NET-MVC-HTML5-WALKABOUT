(function() {
  var WalkaboutGenerator, fs, generator, path;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  WalkaboutGenerator = (function() {
    var excludePaths, filenames, output, songLines, source;

    source = '../..';

    output = 'songlines.js';

    excludePaths = [];

    filenames = [];

    songLines = [];

    function WalkaboutGenerator() {
      var excludePathsIndex, path, paths, _i, _len;
      if (process.argv[2] === "--exclude") {
        paths = process.argv[3].split(",");
        excludePathsIndex = 0;
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          excludePaths[excludePathsIndex++] = this._getFullPath(path);
        }
      }
    }

    WalkaboutGenerator.prototype.generate = function() {
      console.log("start generate");
      filenames = [];
      songLines = [];
      this._walkSync(source, function(err, dirPath, dirs, files) {
        if (files) {
          return files.forEach(function(file) {
            var fileContents, songLineRegEx;
            fileContents = fs.readFileSync(file, 'utf8');
            songLineRegEx = /<SL[\s\S]*\/>/i;
            if (songLineRegEx.test(fileContents)) {
              filenames.push(file);
              return fileContents.match(songLineRegEx).forEach(function(match) {
                return songLines.push(match);
              });
            }
          });
        }
      });
      fs.writeFileSync(output, JSON.stringify(filenames));
      console.log(filenames.length);
      return console.log(JSON.stringify(songLines));
    };

    WalkaboutGenerator.prototype._walkSync = function(start, callback) {
      var $this, coll, stat, _ref;
      if (_ref = this._getFullPath(start), __indexOf.call(excludePaths, _ref) >= 0) {
        return callback(start, [], []);
      }
      $this = this;
      stat = fs.statSync(start);
      if (stat.isDirectory()) {
        filenames = fs.readdirSync(start);
        coll = filenames.reduce(function(acc, name) {
          var abspath;
          abspath = path.join(start, name);
          if (fs.statSync(abspath).isDirectory()) {
            acc.dirs.push(name);
          } else {
            acc.names.push(name);
          }
          return acc;
        }, {
          "names": [],
          "dirs": []
        });
        callback(start, coll.dirs, coll.names);
        return coll.dirs.forEach(function(d) {
          var abspath;
          abspath = path.join(start, d);
          return $this._walkSync(abspath, callback);
        });
      } else {
        throw new Error("path: " + start + " is not a directory");
      }
    };

    /*
    	generate: ->
    		console.log "start generate"
    		filenames = []
    		@_walkDir source, (err) ->
    			console.log "done"
    			throw err if err
    			fs.writeFileSync output, JSON.stringify(filenames)
    			console.log filenames.length
    
    	_walkDir: (dir, done) -> 
    		console.log dir
    		console.log excludePaths
    		fullDirectoryPath = @_getFullPath(dir)
    		return done null if fullDirectoryPath in excludePaths
    		$this = @
    		fs.readdir dir, (err, list) ->
    			done err if err
    			pending = list.length
    			return done null if not pending
    			list.forEach (directoryItem) ->
    				fullDirectoryItemPath = "#{fullDirectoryPath}/#{directoryItem}"
    				console.log file
    				fs.stat fullDirectoryItemPath, (err, stat) ->
    					if stat and stat.isDirectory()
    						console.log stat.isDirectory()
    						$this._walkDir fullDirectoryItemPath, (err, res) ->
    							filenames = filenames.concat(res)
    							console.log pending
    							done null, filenames if not --pending
    					else
    						fileContents = fs.readFileSync file, 'utf8'
    					
    						songLineRegEx = ///<SL[\s\S]*[(/>)|(</SL>)]///i
    						if songLineRegEx.test fileContents
    							filenames.push file
    							
    							fileContents.match(songLineRegEx).forEach (match) ->
    								filenames.push match
    							
    
    						done null, filenames if not --pending
    */

    WalkaboutGenerator.prototype._getFullPath = function(path) {
      return fs.realpathSync(path.replace(/^\s\s*/, '').replace(/\s\s*$/, '')).replace(/\\/g, "/");
    };

    return WalkaboutGenerator;

  })();

  generator = new WalkaboutGenerator;

  generator.generate();

}).call(this);
