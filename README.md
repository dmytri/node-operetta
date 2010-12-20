<code>
~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
 _____  ____  ____  ____  ____  ____  ____   __
(  _  )(  _ \( ___)(  _ \( ___)(_  _)(_  _) /__\
 )(_)(  )___/ )__)  )   / )__)   )(    )(  /(__)\
(_____)(__)  (____)(_)\_)(____) (__)  (__)(__)(__)

        A Node Option Parser That Sings!

~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~ ~~~
</code>

# Plot Summary #

## Options ##

**All options are arguments, but not all arguments are options.**

 $ nurl -I --insecure https://topsyturvey.onion/mikado.mkv

In the example above, the program nget has three arguments, two of which are
options. Options are arguments that are one letter long and start with a dash
(-), these are "short options," or many letters long and start with a double
dash (--) (long option), these are long options. Arguments that are not options
agree also called "positional" arguments, because they have no name, so can
only be referred to by there position following the command.

Operetta would parse the above example as follows:

<code>
{ positional: [ 'https://topsyturvey.onion/mikado.mkv' ],
 '-I': [ true ],
 '--insecure': [ true ]}
</code>

For the program to receive these values, it calls the start function with a
callback.

<code>
var Operetta = require("operetta").Operetta;
operetta = new Operetta();
operetta.start(function(values) {
  console.log(values);
});
</code>

Simple, right? And quite enough for many programs.  But that is not all, oh no
that is not all!

## Parameters ##

**All parameters are options but not all options are parameters.**

 $ nysql --database secret_database --host=control.onion -usmart -p Iheart99

Sometimes options take a value. We call these Parameters.

The above shows the four valid forms to set values. Without any further
instruction, Operetta would parse the above as follows:

<code>
{ positional: [ 'secret_database', 'Iheart99' ],
 '--database': [ true ],
 '--host': [ 'control.onion' ],
 '-u': [ true ],
 '-s': [ true ],
 '-m': [ true ],
 '-a': [ true ],
 '-r': [ true ],
 '-t': [ true ],
 '-p': [ true ]
}
</code>

Uhgg. That's probably not what we want. It got --host right, because that is
the most unambiguous form for a parameter to take, a long option connected to a
value by an equal sign. However the rest, what a mess! Since it doesn't know
that --database and -p are parameters, it treats "secret_database" and
"Iheart99" as positional arguments," and since short options can be chained
together, Operetta thinks "usmart" is a chain of 6 options. We're going to have
to give operetta more information to handle these correctly.

<code>
var Operetta = require("operetta").Operetta;
operetta = new Operetta();
operetta.parameters(['-D','--database'], "Database");
operetta.parameters(['-H','--host'], "Host");
operetta.parameters(['-u','--user'], "User");
operetta.parameters(['-p','--password'], "Password");
operetta.start(function(values) {
  console.log(values);
});
</code>

We use the parameters method to tell Operetta some things about our parameters,
first we pass a list of options, i.e. [['-D','--database'], this gives the long
and short form of the option, then we give a description.

Now, we get the follow values:

<code>
{ positional: [],
 '-D': [ 'secret_database' ],
 '-H': [ 'control.onion' ],
 '-u': [ 'smart' ],
 '-p': [ 'Iheart99' ]}
</code>

Much better! Note that the key for the value is always the first item in the
options list passed, so -D is present, even though --database was used.

## Help ##

What's more is now that we have descriptions, operetta will automatically bind
the options -h and --help to show these descriptions.

<code>
$ nysql --help

Usage:
-D,--database  Database
-H,--host      Host
-u,--user      User
-p,--password  Password
-h,--help      Show Help
</code>

Nifty, huh? But what about plain old options? We may want to give these
descriptions too. For example, in our earlier nurl example, we may want to
provide descriptions for -I and --insecure. We can use the options function for
this.

<code>
operetta.options(['-I','--head'], "Show document info only");
operetta.options(['-k','--insecure'], "Allow connections to SSL sites without certs");
</code>

If you really insist, you can can override -h and --help using either the
options or parameters function, you can then then get the help output by
calling the usage function, either with out without a callback.

<code>
// this will call console.log with help output.
operetta.usage();
// this will pass usage text to a callback.
operetta.usage(function(help) {
  console.log(help);
});
</code>

We can add a banner above line that says "Usage."

<code>
operetta.banner = "NySQL. The Nultimate Natabase!\n";
</code>

Now we get the following Help:
<code>
NySQL. The Nultimate Natabase!

Usage:
-D,--database  Database
-H,--host      Host
-u,--user      User
-p,--password  Password
-h,--help      Show Help
</code>

There you go! Now you can add options and parameters to your program and have
it display nice help with the descriptions. That's all you need right? But that
is not all operetta can do! Oh no, that is not all!

## Events ##

Sometimes you don't just want all the options parsed and dumped to a single
callback as a values object, but you wold rather have an event triggered for
each option. Here is where Operetta Sings!

The operetta object is an EventEmitter, so you can bind events with the on
option.

<code>
operetta.on('-k', function(value) {
  console.log('Warning! The url you are requesting has not given any money to the SSL root certificate racketeers, and so while it's probably perfectly secure, it is not contributing to the profits of any money grubbing certificate authority!');
});
</code>

Since -k is just an option, value will always be true when this event is
called, in the case of a parameter, value will be the value passed or null if
none was passed.

While using the on function works, the preferred way to set a callback is to
pass it as the third argument to either the options or parameters function.

<code>
operetta.options(['-k','--insecure'], "Allow connections to SSL sites without certs", function(value) {
  console.log('Danger! Danger, Will Robinson!');
});
</code>

So there you have it, Options, Parameters, Help and Events. Surely that's the
end of this interminable readme file? No! That's not all. And stop calling me
Shirley.

## Subcommands

Sometimes programs have different commands, each with their own options, i.e.

<code>
 $ nit clone http://nitnub.onion/nit.nit
 $ nit commit -am "lotsa great codez"
 $ nit push origin master
</code>

If the program nit has many subcommands, i.e. clone, commit, push then each of
these could have their own options and help. Operetta has a command function
that allows you to define these and get a new instance of operetta just for
these commands.

<code>
operetta.command('clone', "Clone a Repo", function(command) {
  command.start(function(values) {
    var url = values.positional[0];
  });.
});
operetta.command('commit', "Commit Changes", function(command) {
  command.options(['-a','--all'], "Tell the command to automatically stage files that have been modified and deleted, but new files you have not told git about are not affected.");
  command.parameters(['-m','--message'], "Use the given message as the commit message.", function(value) {
    console.log("Staging modified files.");
  });.
  command.start();
});
operetta.command('push', "Push To Remote Repo", function(command) {
  command.start(function(values) {
    var remote = values.positional[0],
      branch = values.positional[1];
  });.
});
operetta.start();
</code>

Now, if you called help without a subcommand:

 $ nit -h

<code>
Usage:
clone          Clone a Repo
commit         Commit Changes
push           Push To Remote Repo
-h,--help      Show Help
</code>

You get a list of the subcommands.

However, if you call help on commit:

 $ nit commit --help

<code>
Usage:
-a,--all       Tell the command to automatically stage files that have been modified and deleted, but new files you have not told git about are not affected.
-m,--message   Use the given message as the commit message.
-h,--help      Show Help
</code>

You get the descriptions of the options defined for commit.

And yes, if you really want, subcommand can have subcommands:

<code>
operetta.command('submodule', "Manage Submodules", function(command) {
  command.commands('add', "Add A submodule to the repo", function(subcommand) {
    subcommand.start();
  });.
});
</code>

Now you could do:

 $ nit submodule add http://nitorious.onion/nitorious.nit

# Coda #

So, options, parameters, help, events and subcommands. Shirley, you're thinking
operetta must be some big, baroque, bloated, blob of blubbery JavaScript! Well,
here's what SLOCcount has to say:

<code>
Total Physical Source Lines of Code (SLOC)                = 107
Development Effort Estimate, Person-Years (Person-Months) = 0.02 (0.23)
 (Basic COCOMO model, Person-Months = 2.4 * (KSLOC**1.05))
 Schedule Estimate, Years (Months)                         = 0.12 (1.43)
  (Basic COCOMO model, Months = 2.5 * (person-months**0.38))
</code>

That's right, small and cheap. So far it's only got One Hundred and Seven Lines
of Code, so get it while it's small. Before I add thousands lines to support
such must-have features as sending and receiving email and impersonating a
teenager in IRC channels.

And yes, I called you Shirley.


