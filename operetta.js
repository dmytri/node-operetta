/**************************************************
 *
 * Operetta: A Node Option Parser That Sings!
 * Dmytri Kleiner <dk@trick.ca>
 *
 * This program is free software. 
 * It comes without any warranty, to the extent permitted by
 * applicable law. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License v2.
 * See http://sam.zoy.org/wtfpl/COPYING for more details. 
 *
 * Plot Summary
 *
 * All options are arguments, but not all arguments are options.
 * Options are arguments that are 1 letter long and start with -
 * (short option) or many letters long and start with -- (long option)
 *
 * All paramaters are options but not all options are paramaters
 * parameters are options that take values, these can be seperated by
 * a space from the option or in the case of short option follow it 
 * immediately. In the case of long options, values can follow =
 * Also, short options can be added together following a single dash,
 * only the last of these can be a pramater.
 *
 * Examples:
 *
 * Short Option: -t
 * Many Short Options: -abcde
 * Short Parameter: -t test or -ttest
 * Some Short options with one paramater: -abcdettest or -abcdet test
 * Long Option: --test
 * Long Parameter: --test test or --test=test
 *
 * Any argument that doesn't follow a paramater is passed as positional.
 * In the case of:
 * --test=test /tmp/test
 * /tmp/test is a positional argument
 * however, in:
 * --test /tmp/test
 * /tmp/test is the value of parameter --test
 *
 ***********************************/

var events = require('events'),
  sys = require('sys');

var Operetta = function(args) {
  this.args = args || process.argv;
  // options which are paramaters
  this.params = {};
  // options which are not paramaters
  this.opts = {};
  this.commands = {};
  this.values = [];
  this.banner = '';
  this.help = '';
  this.parent = null;
  // universal option detector
  this.re = /^(-[^-])([A-Za-z0-9_\-]+)?$|^(--[A-Za-z0-9_\-]+)[=]?(.+)?$/;
  this.parse = function(listener) {
    var operetta = this, parameter;
    var sing = function(argument, data) {
      operetta.values[argument] = operetta.values[argument] || [];
      operetta.values[argument].push(data);
      operetta.emit(argument, data);
      if (operetta.parent) operetta.parent.emit(argument, data);
      parameter = undefined
    }
    var process = function(option, data) {
        parameter = operetta.params[option];
        if (data || !parameter) sing(parameter || operetta.opts[option], data || true);
    }
    while (operetta.args.length > 0) {
      var arg = operetta.args.shift(),
        m = operetta.re.exec(arg);
      if (m) {
        if (parameter) sing(parameter, null);
        if (m[2]) {
          var options = m[1][1] + m[2];
          for (i in options) {
            var option = operetta.opts["-" + options[i]];
            if (option) process(option);
            else {
              process("-" + options[i], options.slice(parseInt(i) + 1));
              break;
            }
          }
        } else process(m[1] || m[3], m[4]);
      } else if (parameter) sing(parameter, arg);
      else sing("positional", arg);
    }
    if (listener) listener(operetta.values);
  };
};
sys.inherits(Operetta, events.EventEmitter);

Operetta.prototype.start = function(listener) {
  if (this.commands.length > 0) {
    var command = operetta.args[0],
    callback = this.commands(command);
    if (listener) {
      operetta.args.shift(),
      operetta = new Operetta(operetta.args);
      operetta.parent = this;
      callback(operetta);
    }
  }
  this.parse(listener);
};

Operetta.prototype.bind = function(args, description, listener, takes_arguments) {
  if (args) {
    var operetta = this;
    if (!(args != null && typeof args === "object" && "join" in args)) args = [args];
    var key = args[0];
    sargs = args.join(",");
    operetta.help += "\n" + args + Array(16 - sargs.length).join(" ") + description;
    args.forEach(function(option){
      if (takes_arguments) operetta.params[option] = key;
      else operetta.opts[option] = key;
    });
    if (listener) operetta.on(key, listener);
  }
};

Operetta.prototype.parameters = function(args, description, listener) {
  this.bind(args, description, listener, true);
};

Operetta.prototype.options = function(args, description, listener) {
  this.bind(args, description, listener, false);
};

Operetta.prototype.command = function(command, description, listener) {
  this.help += "\n" + command + Array(16 - command.length).join(" ") + description;
  this.commands[command] = listener;
};

Operetta.prototype.usage = function(values, listener) {
  var operetta = this;
  var usage = [operetta.banner, operetta.help].join("\n");
  if (listener) {
    listener(usage);
  } else {
    console.log(usage);
  }
};

exports.Operetta = Operetta;

