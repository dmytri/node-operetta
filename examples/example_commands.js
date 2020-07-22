const Operetta = require('../index.js')

const args = ['say', '-x', '--name', 'Gilbert', 'hello', 'there']

const operetta = new Operetta(args)
operetta.command('say', 'say something', (command) => {
  command.parameters(['-n', '--name'], 'Add Name ')
  command.options('-x', 'Add Exlamation Mark')
  command.start(function (values) {
    let saying = values.positional.join(' ')
    if (values['-n']) {
      saying = saying + ', ' + values['-n'][0]
    }
    if (values['-x']) {
      saying = saying + '!'
    }
    console.log(saying)
  })
})

operetta.start()
