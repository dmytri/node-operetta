require.paths.push('..');
var Operetta = require("operetta").Operetta;
operetta = new Operetta();
operetta.command('clone', "Clone a Repo", function(command) {
  command.start(function(values) {
    var url = values.positional[0];
  }); 
});
operetta.command('commit', "Commit Changes", function(command) {
  command.options(['-a','--all'], "Tell the command to automatically stage files that have been modified and deleted, but new files you have not told git about are not affected.");
  command.parameters(['-m','--message'], "Use the given message as the commit message.", function(value) {
    console.log("Staging modified files.");
  }); 
  command.start();
});
operetta.command('push', "Push To Remote Repo", function(command) {
  command.start(function(values) {
    var remote = values.positional[0],
      branch = values.positional[1];
  }); 
});
operetta.start();
