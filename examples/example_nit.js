const Operetta = require('../index.js')
const operetta = new Operetta()
operetta.command('clone', 'Clone a Repo', (command) => {
  command.start((values) => {
    console.log('url', values.positional[0])
  })
})
operetta.command('commit', 'Commit Changes', (command) => {
  command.options(['-a', '--all'], 'Tell the command to automatically stage files that have been modified and deleted, but new files you have not told git about are not affected.')
  command.parameters(['-m', '--message'], 'Use the given message as the commit message.', (value) => {
    console.log('Staging modified files.')
  })
  command.start()
})
operetta.command('push', 'Push To Remote Repo', (command) => {
  command.start((values) => {
    console.log('remote', values.positional[0])
    console.log('branch', values.positional[1])
  })
})
operetta.start()
