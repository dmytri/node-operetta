require.paths.push('..');
var Operetta = require("operetta").Operetta;
operetta = new Operetta();
operetta.parameters(['-D','--database'], "Database");
operetta.parameters(['-H','--host'], "Host");
operetta.parameters(['-u','--user'], "User");
operetta.parameters(['-p','--password'], "Password");
operetta.banner = "NySQL. The Nultimate Natabase!\n";
operetta.start(function(values) {
  console.log(values);
});

