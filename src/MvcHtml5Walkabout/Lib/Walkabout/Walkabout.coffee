fs   = require 'fs'
path = require 'path'

class WalkaboutGenerator
	source       = '../..'
	output       = 'songlines.js'
	excludePaths = []
	filenames = []
	songLines = []

	constructor: () -> 
		if process.argv[2] is "--exclude"
			paths = process.argv[3].split ","
			excludePathsIndex = 0
			excludePaths[excludePathsIndex++] = @_getFullPath(path) for path in paths

	generate: ->
		console.log "start generate"
		filenames = []
		songLines = []
		@_walkSync source, (err, dirPath, dirs, files) ->
			if files
				files.forEach (file) ->
					fileContents = fs.readFileSync file, 'utf8'
					songLineRegEx = ///<SL[\s\S]*/>///i
					if songLineRegEx.test fileContents
						filenames.push file
						fileContents.match(songLineRegEx).forEach (match) ->
							songLines.push match

		fs.writeFileSync output, JSON.stringify(filenames)
		console.log filenames.length
		console.log JSON.stringify songLines

	_walkSync: (start, callback) ->
		return callback start, [], [] if @_getFullPath(start) in excludePaths

		$this = @
		stat = fs.statSync start

		if stat.isDirectory()
			filenames = fs.readdirSync start

			coll = filenames.reduce (acc, name) ->
				abspath = path.join start, name

				if fs.statSync(abspath).isDirectory()
					acc.dirs.push name
				else
					acc.names.push name

				return acc;
			, {"names": [], "dirs": []}

			callback start, coll.dirs, coll.names

			coll.dirs.forEach (d) ->
				abspath = path.join(start, d);
				$this._walkSync abspath, callback

		else
			throw new Error("path: " + start + " is not a directory");
	  
	###
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
	###

	_getFullPath: (path) ->
		fs.realpathSync(path.replace(/^\s\s*/, '').replace(/\s\s*$/, '')).replace(/\\/g, "/")

generator = new WalkaboutGenerator
generator.generate()