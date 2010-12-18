
require.paths.push('.');

var Operetta = require('operetta').Operetta;

var args = ['test', 'hello', 
  '-t', '-tclosetest', '-xtcloser', '-xt', 'another', 'test', '--test', 'long', 'test',
  '-t', 'short', 'test', '--test=equals_test','--flag','/path/to/some/file'];

console.log("[", args.join(" "), "]\n");

var operetta = new Operetta(args);
operetta.command('say', function(command) {
  command.start(function(values) {
    console.log(values);
  });
});

operetta.start();

operetta.usage();

