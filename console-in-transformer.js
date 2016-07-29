var fs = require('fs')

var processInput = function(transform, additionalDataTerminator) {
	additionalDataTerminator = additionalDataTerminator || ''
	if(process.argv.length > 2) {
		// This means there is an argument to the command
		if(process.argv[2] == '-') {
			processStdIn(transform)
		}
		else {
			var data = fs.readFileSync(process.argv[2]).toString()
			process.stdout.write(transform(data) + additionalDataTerminator);
		}
	}
	else {
		// No arguments to the command. Let's assume they want to process stdin
		// This has the nice effect allowing content either piped in or allowing
		// the user to paste in content (ctrl-d terminates).
		processStdIn(transform)
	}

	function processStdIn(transform) {
		process.stdin.setEncoding('utf8');

		var data = ''
		process.stdin.on('readable', () => {
			var chunk = process.stdin.read();
			if (chunk !== null) {
				data += chunk
			}
		})

		process.stdin.on('end', () => {
			process.stdout.write(transform(data) + additionalDataTerminator);
		})
	}
}

module.exports = processInput