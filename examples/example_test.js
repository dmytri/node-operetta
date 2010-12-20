
require.paths.push('..');
var Operetta = require('operetta').Operetta;

var operetta = new Operetta();
operetta.command("say", "Say Something", function(command) {
  command.start(function(values) {
    console.log(values.positional.join(" "));
    console.log(values);
  });
});
operetta.parameters(["-p","--param"], "A Parameter", function(value) {
  console.log("Value:", value);
});
operetta.start(function(values) {
  console.log(values);
});

operetta.start();


