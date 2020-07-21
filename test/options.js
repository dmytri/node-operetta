const test = require('tape')
const Operetta = require('../index.js')

const A = '["one", "two", "-X", "--parameter", "parameter", "-Avalue", "--key=value", "-s", "set", "-z"]'

test('no arguments', (t) => {
  t.plan(1)
  const result = { positional: [] }
  new Operetta([]).start((v) => {
    t.same(v, result)
  })
})

test('no configuration', (t) => {
  t.plan(1)
  const result = {
    positional: ['one', 'two', 'parameter', 'set'],
    '-X': [true],
    '--parameter': [true],
    '-A': [true],
    '-v': [true],
    '-a': [true],
    '-l': [true],
    '-u': [true],
    '-e': [true],
    '-s': [true],
    '--key': ['value'],
    '-z': [true],

  }

  new Operetta(JSON.parse(A)).start((v) => {
    t.same(v, result)
  })
})

test('parameters', (t) => {
  t.plan(1)

  const result = {
    positional: ['one', 'two'],
    '-X': [true],
    '-p': ['parameter'],
    '-A': ['value'],
    '-s': ['set'],
    '--key': ['value'],
    '-z': [true]
  }

  const operetta = new Operetta(JSON.parse(A))
  operetta.parameters(['-p', '--parameter'], 'Parameter')
  operetta.parameters(['-A', '--value'], 'Value')
  operetta.parameters(['-s', '--set'], 'Set')
  operetta.start((v) => {
    t.same(v, result)
  })
})

test('events', (t) => {
  t.plan(3)

  const result = {
    positional: ['one', 'two', 'parameter'],
    '-X': [true],
    '--parameter': [true],
    '-A': [true],
    '-v': [true],
    '-a': [true],
    '-l': [true],
    '-u': [true],
    '-e': [true],
    '-s': ['set'],
    '--key': ['value']
  }

  const operetta = new Operetta(JSON.parse(A))
  operetta.parameters(['-s', '--set'], 'Set')
  operetta.parameters(['-z', '--zap'], 'Zap')
  operetta.on('-s', (v) => {
    t.same(v, 'set')
  })
  operetta.on('-X', (v) => {
    t.same(v, true)
  })
  operetta.on('-z', (v) => {
    t.same(v, null)
  })
  operetta.start((v) => {
    t.same(v, result)
  })

})
