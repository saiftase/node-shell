var commands = require('./commands.js');

process.stdout.write('prompt > ');

process.stdin.on('data', function(data) {
  var string = data.toString().trim(); // remove the newline

  
  var array = string.split(' ');
  var cmd = array.shift();
  
  commands[cmd](array);

});
