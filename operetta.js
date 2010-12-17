/***************************************************
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
 ***********************************/

var events = require('events'),
  sys = require('sys');

var Operetta = function(args) {
  this.args = args || process.argv;
  this.params = {};
  this.opts = {};
  this.values = [];
  this.banner = '';
  this.help = '';
  this.re = /^(-[^-])([A-Za-z0-9_\-]+)?$|^(--[A-Za-z0-9_\-]+)[=]?(.+)?$/;
};
sys.inherits(Operetta, events.EventEmitter);

Operetta.prototype.start = function(listener) {
  var operetta = this, option, value;
  var trigger = function() {
    if (option || value) {
      option = option || 'positional';
      operetta.values[option] = operetta.values[option] || [];
      operetta.values[option].push(value);
      operetta.emit(option, value);
      option = undefined
      value = undefined
    }
  }
  while (operetta.args.length > 0) {
    var arg = operetta.args.shift(),
      m = operetta.re.exec(arg);
    if (m) {
      trigger();
      if (m[2]) {
        m[2] = m[1][1] + m[2];
        for (c in m[2]) {
          var o = '-' + m[2][c];
          if (o in operetta.opts) {
            option = operetta.opts[o];
            trigger();
          } else {
            if (o in operetta.params) {
              option = operetta.params[o];
              if (m[2].length > c) {
                value = m[2].slice(parseInt(c) + 1);
                trigger();
              }
            } else {
              option = undefined;
            }
            break;
          }
        }
      } else {
        var o = m[1] || m[3];
        if (o in operetta.params) {
          value = m[2] || m[4];
          option = operetta.params[o];
          if (value) {
            trigger();
          }
        } else {
          option = operetta.opts[o];
          trigger();
        }
      }
    } else {
      if (value) {
        value += ' ' + arg;
      } else {
        value = arg;
      }
    }
  }
  trigger();
  if (listener) {
    listener(operetta.values);
  }
};

Operetta.prototype.bind = function(args, description, listener, takes_arguments) {
  if (args) {
    var operetta = this;
    if (!(args != null && typeof args === "object" && 'join' in args)) {
      args = [args];
    }
    var key = args[0];
    sargs = args.join(",");
    operetta.help += "\n" + args + Array(16 - sargs.length).join(" ") + description;
    args.forEach(function(option){
      if (takes_arguments) {
        operetta.params[option] = key;
      } else {
        operetta.opts[option] = key;
      }
    });
    if (listener) {
      operetta.on(key, listener);
    }
  }
};

Operetta.prototype.parameters = function(args, description, listener) {
  this.bind(args, description, listener, true);
};

Operetta.prototype.options = function(args, description, listener) {
  this.bind(args, description, listener, false);
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

