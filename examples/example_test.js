
var Operetta = require('../index.js')

var operetta = new Operetta()
operetta.command('say', 'Say Something', (command) => {
  command.start(function (values) {
    console.log(values.positional.join(' '))
    console.log(values)
  })
})
operetta.parameters(['-p', '--param'], 'A Parameter', (value) => {
  console.log('Value:', value)
})
operetta.start((values) => {
  console.log(values)
})

operetta.start()
