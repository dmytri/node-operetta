const Operetta = require('../index.js')
const operetta = new Operetta()
operetta.parameters(['-D', '--database'], 'Database')
operetta.parameters(['-H', '--host'], 'Host')
operetta.parameters(['-u', '--user'], 'User')
operetta.parameters(['-p', '--password'], 'Password')
operetta.banner = 'NySQL. The Nultimate Natabase!\n'
operetta.start((values) => {
  console.log(values)
})
