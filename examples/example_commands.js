
require.paths.push('..');

var Operetta = require('operetta').Operetta;
var sys = require('sys');

var args = ['say', '-x', '--name', 'Gilbert', 'hello', 'there'];

var operetta = new Operetta(args);
operetta.command('say', 'say something', function(command) {
  command.parameters(["-n","--name"], "Add Name ");
  command.options("-x", "Add Exlamation Mark");
  command.start(function(values) {
    var saying = values.positional.join(" ");
    if (values["-n"]) {
      saying = saying + ", " + values["-n"][0];
    };
    if (values["-x"]) {
      saying = saying + "!";
    };
    console.log(saying);
  });
});

operetta.start();

