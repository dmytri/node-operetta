/**************************************************
 *
 * Operetta: A Node Option Parser That Sings!
 * Dmytri Kleiner <dk@trick.ca>
 *
 **********************************/

'use strict'
const EventEmitter = require('events')

module.exports = class Operetta extends EventEmitter {
  constructor (argv) {
    super()

    if (argv) this.argv = argv
    else {
      if (process.argv[0].slice(-4) === 'node') this.argv = process.argv.slice(2)
      else this.argv = process.argv.slice(1)
    }
    // options which are parameters
    this.params = {}
    // options which are not parameters
    this.opts = {}
    this.commands = {}
    this.values = {}
    this.values.positional = []
    this.banner = ''
    this.help = 'Usage:'
    this.parent = null
    // universal option detector
    this.re = /^(-[^-])([A-Za-z0-9_-]+)?$|^(--[A-Za-z0-9_-]+)[=]?(.+)?$/
    this.parse = (listener) => {
      let parameter
      const sing = (argument, data) => {
        argument = argument || current
        this.values[argument] = this.values[argument] || []
        this.values[argument].push(data)
        if (this.listeners(argument).length > 0) this.emit(argument, data)
        parameter = undefined
        current = undefined
      }
      const process = (option, data) => {
        parameter = this.params[option]
        if (data || !parameter) sing(parameter || this.opts[option] || option, data || true)
      }
      while (this.argv.length > 0) {
        var current = this.argv.shift()
        var m = this.re.exec(current)
        if (m) {
          if (parameter) sing(parameter, null)
          if (m[2]) {
            var options = m[1][1] + m[2]
            for (const i in options) {
              var a = this.params['-' + options[i]]
              if (a) {
                process(a, options.slice(parseInt(i) + 1))
                break
              } else process('-' + options[i])
            }
          } else process(m[1] || m[3], m[4])
        } else if (parameter) sing(parameter, current)
        else sing('positional', current)
      }
      if (listener) listener(this.argopt)
    }

    this.argopt = new Proxy(this.values, {
      get (target, name) {
        const v = Reflect.get(target, name)
        if (v) {
          if (Array.isArray(v) && v.length === 1) {
            return v[0]
          } else {
            return v
          }
        }
      }
    })
  }

  start (callback) {
    if (this.parent && this.argv.length === 0 && this.noop === false) this.usage()
    else {
      if (!this.opts['-h']) {
        this.options(['-h', '--help'], 'Show Help', () => {
          this.usage()
          process.exit(1)
        })
      }
      const arg = this.argv[0]
      const command = this.commands[arg]
      if (command) {
        this.argv.shift()
        const child = new Operetta(this.argv)
        child.parent = this
        command(child)
      }
      this.parse(callback)
    }
  }

  bind (argv, description, listener, takesArguments) {
    if (argv) {
      if (!(typeof argv === 'object' && 'join' in argv)) argv = [argv]
      const key = argv[0]
      const sargv = argv.join(',')
      this.help += '\n' + argv + Array(16 - sargv.length).join(' ') + description
      argv.forEach((option) => {
        if (takesArguments) this.params[option] = key
        else this.opts[option] = key
      })
      if (listener) this.on(key, listener)
    }
  }

  parameters (argv, description, listener) {
    this.bind(argv, description, listener, true)
  }

  options (argv, description, listener) {
    this.bind(argv, description, listener, false)
  }

  command (command, description, listener) {
    this.help += '\n' + command + Array(16 - command.length).join(' ') + description
    this.commands[command] = listener
  }

  usage (listener) {
    const usage = [this.banner, this.help].join('\n')
    if (listener) {
      listener(usage)
    } else {
      console.log(usage)
    }
  }

  static get operetta () {
    return new Operetta()
  }
}
