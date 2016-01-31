var commands = require('./commands.js');

process.stdout.write('prompt > ');

var commandList;
var tempOutput = undefined;

process.stdin.on('data', run);

function run(data) {
  var string = data.toString().trim(); // remove the newline
  commandList = string.split(/\s *\| \s*/g); //List of commands, split by pipe
  
  var argv = commandList.shift().split(' '); //Arguments given to first command
  var cmd = argv.shift(); //First command

  commands[cmd](tempOutput, argv, done);

}

var done = function(output){
  tempOutput = undefined;
  if(commandList.length > 0){
  	tempOutput = output;
  	run(commandList.join(" | "));
  }else{
  	process.stdout.write(output);
  	process.stdout.write("\nprompt > ");
  }
}