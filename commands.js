var fs = require('fs');

module.exports = {
  	pwd: function(){
  		process.stdout.write(process.cwd());
  		process.stdout.write('\nprompt > ');
  	},
  	date: function(){
  		var d = new Date();
  		process.stdout.write(d.toString());
  		process.stdout.write('\nprompt > ');
  	},
  	ls: function(){
  		fs.readdir('.', function(err, files){
  			if(err) throw err;
  			files.forEach(function(file){
  				process.stdout.write(file.toString() + "\n");
  			});
  			process.stdout.write("prompt > ");
  		});
  	},
  	echo: function(array) {
  		var stringoutput = array.join(' ');


  		process.stdout.write(stringoutput + "\n");
  		process.stdout.write("prompt > ");
  	},
  	cat: function(array) {
  		var output = "";
  		array.forEach(function(currentValue, idx, array) {
  			output += fs.readFileSync(currentValue, 'utf-8') + "\n";
  		});
  		process.stdout.write(output);
  		process.stdout.write("prompt > ");
  		
  	},

  	head: function(array) {
  		var string = "";
  		var lines = "";
  		var linesArr;
  		var fiveLines = "";
  		array.forEach(function(currentValue, idx, array) {
  			string += fs.readFileSync(currentValue, 'utf-8') + "\n";
  			linesArr = string.split("\n");
  			var limit = linesArr.length < 5 ? linesArr.length : 5;
  			for(var i = 0; i < limit; i++){
  				 fiveLines += linesArr[i] + "\n";
  			}
  		});
  		process.stdout.write(fiveLines);
  		process.stdout.write("prompt > ");
  		
  	},

  	tail: function(array) {

  		var fileOutput = "";
  		var follow = false;

  		function processFile(filename){
  			var fileString = fs.readFileSync(filename, 'utf-8') + "\n";
  			var linesArray = fileString.split("\n");
  			linesArray = linesArray.slice(linesArray.length - (5 + 1) );
  			process.stdout.write(linesArray.join("\n"));

  			if (follow) process.stdout.write("prompt > ")
  		}

  		if(array.indexOf('-f') === 0){
  			array.shift();
  			follow = true;
  		}
  		
  		array.forEach(function(currentValue, idx, array) {
  			if(follow){
  				//var options = {persistent:true, recursive: false};
  				console.log('fswatch', currentValue);
  				fs.watchFile(currentValue, {interval: 100}, function(curr, prev){
  					process.stdout.write("\n");
  					processFile(currentValue);

  				});
  			}

  			processFile(currentValue);
  			
  		});

  		// process.stdout.write(fileOutput);


  		if (!follow) process.stdout.write("prompt > ");	
  	},

  	sort: function(array){
  		// open file
  		// sort by first letter in line
  		// output

  		var filename = array[0],
  			output;

  		// console.log('heres the file name', filename);
  		var newData = fs.readFileSync(filename,'utf-8');
  		// console.log(newData);
  		output = newData.split('\n');
  		output = output.sort().join('\n');

  		process.stdout.write(output);
  		process.stdout.write("\nprompt >");
  	},

  	wc: function(array) {
  		var filename = array[0],
  			output;

  		output = fs.readFileSync(filename,'utf-8');
  		output = output.split('\n');

  		process.stdout.write(output.length + "");
  		process.stdout.write("\nprompt >");
  	},

  	uniq: function(array){
  		var filename = array[0],
  			input,
  			output = [],
  			topLine = "";

  		input = fs.readFileSync(filename,'utf-8');
  		input = input.split('\n');

  		for(var i = 0; i < input.length; i++){
  			if (input[i] !== topLine){
  				output.push(input[i]);
  			}
  			topLine = output[i];
  		}


  		process.stdout.write(output.join("\n"));
  		process.stdout.write("\nprompt >");
  	}

  }