const test = require('tape')
const Operetta = require('../index.js')

const A = 'one two -X --parameter parameter -Avalue --key=value -s set -s again -z'

test('no arguments', (t) => {
  t.plan(1)
  const result = { positional: [] }
  new Operetta([]).start((v) => {
    t.same(v, result, 'expected result')
  })
})

test('no configuration', (t) => {
  t.plan(1)
  const result = {
    positional: ['one', 'two', 'parameter', 'set', 'again'],
    '-X': true,
    '--parameter': true,
    '-A': true,
    '-v': true,
    '-a': true,
    '-l': true,
    '-u': true,
    '-e': true,
    '-s': [true, true],
    '--key': 'value',
    '-z': true
  }

  new Operetta(A.split(' ')).start((v) => {
    t.same(v, result, 'expected result')
  })
})

test('parameters', (t) => {
  t.plan(1)

  const result = {
    positional: ['one', 'two'],
    '-X': true,
    '-p': 'parameter',
    '-A': 'value',
    '-s': ['set', 'again'],
    '--key': 'value',
    '-z': true
  }

  const operetta = new Operetta(A.split(' '))
  operetta.parameters(['-p', '--parameter'], 'Parameter')
  operetta.parameters(['-A', '--value'], 'Value')
  operetta.parameters(['-s', '--set'], 'Set')
  operetta.start((v) => {
    t.same(v, result, 'expected result')
  })
})

test('events', (t) => {
  t.plan(6)

  const result = {
    positional: ['one', 'two', 'parameter'],
    '-X': true,
    '--parameter': true,
    '-A': true,
    '-v': true,
    '-a': true,
    '-l': true,
    '-u': true,
    '-e': true,
    '-s': ['set', 'again'],
    '--key': 'value'
  }

  const usage = 'Banner\nUsage:\n-s,--set       Set\n-z,--zap       Zap'

  const operetta = new Operetta(A.split(' '))
  operetta.banner = 'Banner'
  operetta.parameters(['-s', '--set'], 'Set')
  operetta.parameters(['-z', '--zap'], 'Zap')
  operetta.on('-z', (v) => {
    t.fail('unset parameter should not raise event')
  })
  const vals = ['set', 'again']
  operetta.on('-s', (v) => {
    t.same(v, vals.shift(), 'set parameter value correct')
  })
  operetta.on('-X', (v) => {
    t.same(v, true, 'option value is true')
  })
  operetta.usage((h) => {
    t.same(h, usage, 'expected usage')
  })
  operetta.start((v) => {
    t.same(v, result, 'expected result')
    t.same(vals, [], 'multiple events')
  })
})

test('subcommands', (t) => {
  t.plan(3)

  const result = {
    positional: ['two', 'parameter'],
    '-X': true,
    '--parameter': true,
    '-A': true,
    '-v': true,
    '-a': true,
    '-l': true,
    '-u': true,
    '-e': true,
    '-s': ['set', 'again'],
    '--key': 'value'
  }

  const usage = '\nUsage:\n-s,--set       Set\n-z,--zap       Zap'

  const operetta = new Operetta(A.split(' '))
  operetta.command('one', 'one', (c) => {
    c.parameters(['-s', '--set'], 'Set')
    c.parameters(['-z', '--zap'], 'Zap')
    c.on('-X', (v) => {
      t.same(v, true, 'option value is true')
    })
    c.on('-z', (v) => {
      t.fail('unset parameter should not raise event')
    })
    c.usage((h) => {
      t.same(h, usage, 'expected usage')
    })
    c.start((v) => {
      t.same(v, result, 'expected result')
    })
  })

  operetta.start()
})
