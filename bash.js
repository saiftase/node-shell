var commands = require('./commands.js');

process.stdout.write('prompt > ');

process.stdin.on('data', function(data) {
  var string = data.toString().trim(); // remove the newline

  
  var argv = string.split(' ');
  var cmd = argv.shift();

  commands[cmd](argv, done);

});

var done = function(output){
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
}