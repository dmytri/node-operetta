/**************************************************
 *
 * Operetta: A Node Option Parser That Sings!
 * Dmytri Kleiner <dk@trick.ca>
 *
 ***********************************/

var events = require('events')
var util = require('util')

var Operetta = function (args) {
  if (args) this.args = args
  else {
    if (process.argv[0].slice(-4) === 'node') this.args = process.argv.slice(2)
    else this.args = process.argv.slice(1)
  }
  // options which are paramaters
  this.params = {}
  // options which are not paramaters
  this.opts = {}
  this.commands = {}
  this.values = {}
  this.values.positional = []
  this.banner = ''
  this.help = 'Usage:'
  this.parent = null
  // universal option detector
  this.re = /^(-[^-])([A-Za-z0-9_-]+)?$|^(--[A-Za-z0-9_-]+)[=]?(.+)?$/
  this.parse = function (listener) {
    var operetta = this; var parameter
    var sing = function (argument, data) {
      argument = argument || current
      operetta.values[argument] = operetta.values[argument] || []
      operetta.values[argument].push(data)
      if (operetta.listeners(argument).length > 0) operetta.emit(argument, data)
      parameter = undefined
      current = undefined
    }
    var process = function (option, data) {
      parameter = operetta.params[option]
      if (data || !parameter) sing(parameter || operetta.opts[option] || option, data || true)
    }
    while (operetta.args.length > 0) {
      var current = operetta.args.shift()
      var m = operetta.re.exec(current)
      if (m) {
        if (parameter) sing(parameter, null)
        if (m[2]) {
          var options = m[1][1] + m[2]
          for (var i in options) {
            var a = operetta.params['-' + options[i]]
            if (a) {
              process(a, options.slice(parseInt(i) + 1))
              break
            } else process('-' + options[i])
          }
        } else process(m[1] || m[3], m[4])
      } else if (parameter) sing(parameter, current)
      else sing('positional', current)
    }
    if (listener) listener(operetta.values)
  }
}
util.inherits(Operetta, events.EventEmitter)

Operetta.prototype.start = function (callback) {
  var operetta = this
  if (operetta.parent && operetta.args.length === 0 && operetta.noop === false) operetta.usage()
  else {
    if (!operetta.opts['-h']) {
      operetta.options(['-h', '--help'], 'Show Help', function () {
        operetta.usage()
        process.exit(1)
      })
    }
    var arg = operetta.args[0]
    var command = operetta.commands[arg]
    if (command) {
      operetta.args.shift()
      var child = new Operetta(operetta.args)
      child.parent = operetta
      command(child)
    }
    operetta.parse(callback)
  }
}

Operetta.prototype.bind = function (args, description, listener, takesArguments) {
  if (args) {
    var operetta = this
    if (!(args != null && typeof args === 'object' && 'join' in args)) args = [args]
    var key = args[0]
    var sargs = args.join(',')
    operetta.help += '\n' + args + Array(16 - sargs.length).join(' ') + description
    args.forEach(function (option) {
      if (takesArguments) operetta.params[option] = key
      else operetta.opts[option] = key
    })
    if (listener) operetta.on(key, listener)
  }
}

Operetta.prototype.parameters = function (args, description, listener) {
  this.bind(args, description, listener, true)
}

Operetta.prototype.options = function (args, description, listener) {
  this.bind(args, description, listener, false)
}

Operetta.prototype.command = function (command, description, listener) {
  this.help += '\n' + command + Array(16 - command.length).join(' ') + description
  this.commands[command] = listener
}

Operetta.prototype.usage = function (listener) {
  var operetta = this
  var usage = [operetta.banner, operetta.help].join('\n')
  if (listener) {
    listener(usage)
  } else {
    console.log(usage)
  }
}

module.exports = Operetta
