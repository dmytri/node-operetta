var Operetta = require('../index.js')

var operetta = new Operetta()

operetta.banner = ' _____         _\n'
operetta.banner += '|_   _|__  ___| |_\n'
operetta.banner += '  | |/ _ \\/ __| __|\n'
operetta.banner += '  | |  __/\\__ \\ |_\n'
operetta.banner += '  |_|\\___||___/\\__|\n'

// Operetta is an Event Emitter
// Values that are not preceeded by an option
// Are passed to the 'positional' event;
operetta.on('positional', function (value) {
  console.log('positional:', value)
})

operetta.parameters(['-t', '--test'], 'A Test Argument', (value) => {
  if (value === undefined) {
    // if no value follows options value is undefined
    console.log('Test Nothing')
  } else {
    console.log('Test', value)
  }
})

operetta.options('--flag', 'A Test Option', () => {
  console.log('Flagged!')
})
operetta.options('-x', 'x!', () => {
  console.log('x!')
})

operetta.start(function (values) {
  console.log(values)
})
