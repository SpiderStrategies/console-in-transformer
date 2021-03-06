var fs = require('fs')

var isTTY = process.stdin.isTTY

function printMsgIfNeeded() {
	if(isTTY) {
		console.log('Type or paste the text to be quoted. Press CTRL-D when done.')
	}
}

var processInput = function(transform, additionalDataTerminator) {
	additionalDataTerminator = additionalDataTerminator || ''
	if(processInput.ignoreArguments) {
		printMsgIfNeeded()
		processStdIn(transform)
	}
	else if(process.argv.length > 2) {
		// This means there is an argument to the command
		if(process.argv[2] == '-') {
			processStdIn(transform)
		}
		else if(process.argv[2][0] == '-') {
			// This means there's an argument to the processor. Let's let them handle
			// those.
			
			// This has the nice effect allowing content either piped in or allowing
			// the user to paste in content (ctrl-d terminates).
			printMsgIfNeeded()
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
		printMsgIfNeeded()
		processStdIn(transform)
	}

	function processStdIn(transform) {
		process.stdout.write('ready->\n')
		process.stdin.setEncoding('utf8');

		var data = ''
		process.stdin.on('data', (chunk) => {
			if (chunk !== null) {
				data += chunk
			}
			if(isTTY && chunk && chunk.length > 0) {
				var i = chunk.charCodeAt(chunk.length -1)
				if(i !== 10) {
					// If we got readable data without the last char being a
					// return then somebody pressed a break key.
					process.stdin.emit('end')
				}
			}
		})

		process.stdin.on('end', () => {
			if(isTTY) {
				// if we're typing in a terminal we probably need a marker to tell
				// when the first of the quoted text is being output
				console.log('\nTransformed ->')
			}
			process.stdout.write(transform(data) + additionalDataTerminator);
		})
	}
}

processInput.ignoreArguments = false

module.exports = processInput
