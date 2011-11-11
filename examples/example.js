
require.paths.push('..');
var sys = require('sys');

var Operetta = require('operetta').Operetta;

var args = ['test', 'hello', 
  '-t', '-tclosetest', '-xtcloser', '-xt', 'another', 'test', '--test', 'long', 'test',
  '-t', 'short', 'test', '--test=equals_test','--flag','/path/to/some/file'];

console.log("[", args.join(" "), "]\n");

var operetta = new Operetta(args);

operetta.banner =  " _____         _\n"
operetta.banner += "|_   _|__  ___| |_\n"
operetta.banner += "  | |/ _ \\/ __| __|\n"
operetta.banner += "  | |  __/\\__ \\ |_\n"
operetta.banner += "  |_|\\___||___/\\__|\n"

// Operetta is an Event Emitter
// Values that are not preceeded by an opion
// Are passed to the 'positional' event;
operetta.on('positional', function(value) {
  console.log('positional:', value);
});

operetta.parameters(["-t", "--test"], "A Test Argument", function(value) {
  if (value == undefined) {
    // if no value follows options value is undefined
    console.log("Test Nothing");
  } else {
    console.log("Test", value);
  }
});

operetta.options("--flag", "A Test Option", function() {
  console.log("Flagged!");
});
operetta.options("-x", "x!", function() {
  console.log("x!");
});

operetta.start(function(values) {
  console.log(values);
});

