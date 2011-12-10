fs = require 'fs'
path = require 'path'
source = '../..'
output = 'songlines.js'

filenames = fs.readdirSync("#{source}")

for file, index in filenames then do (file, index) ->
	fileContents = fs.readFileSync "#{source}/#{file}", 'utf8'
	console.log JSON.stringify(file)

fs.writeFileSync output, JSON.stringify(filenames)