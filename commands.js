var fs = require('fs');
var http = require('http');
var request = require('request');

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
  	echo: function(argv) {
  		var stringoutput = argv.join(' ');


  		process.stdout.write(stringoutput + "\n");
  		process.stdout.write("prompt > ");
  	},
  	cat: function(argv) {
  		var output = "";
  		argv.forEach(function(currentValue, idx, argv) {
  			output += fs.readFileSync(currentValue, 'utf-8') + "\n";
  		});
  		process.stdout.write(output);
  		process.stdout.write("prompt > ");
  		
  	},

  	head: function(argv) {
  		var string = "";
  		var lines = "";
  		var linesArr;
  		var fiveLines = "";
  		argv.forEach(function(currentValue, idx, argv) {
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

  	tail: function(argv) {

  		var fileOutput = "";
  		var follow = false;

  		function processFile(filename){
  			var fileString = fs.readFileSync(filename, 'utf-8') + "\n";
  			var linesargv = fileString.split("\n");
  			linesargv = linesargv.slice(linesargv.length - (5 + 1) );
  			process.stdout.write(linesargv.join("\n"));

  			if (follow) process.stdout.write("prompt > ")
  		}

  		if(argv.indexOf('-f') === 0){
  			argv.shift();
  			follow = true;
  		}
  		
  		argv.forEach(function(currentValue, idx, argv) {
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

  	sort: function(argv){
  		// open file
  		// sort by first letter in line
  		// output

  		var filename = argv[0],
  			output;

  		// console.log('heres the file name', filename);
  		var newData = fs.readFileSync(filename,'utf-8');
  		// console.log(newData);
  		output = newData.split('\n');
  		output = output.sort().join('\n');

  		process.stdout.write(output);
  		process.stdout.write("\nprompt >");
  	},

  	wc: function(argv) {
  		var filename = argv[0],
  			output;

  		output = fs.readFileSync(filename,'utf-8');
  		output = output.split('\n');

  		process.stdout.write(output.length + "");
  		process.stdout.write("\nprompt >");
  	},

  	uniq: function(argv){
  		var filename = argv[0],
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
  	},

    // curl: function(argv){
    //   var url = argv[0];
      
    //   var callback = function(response){
    //     var rawHTML = "";

    //     response.on("data", function(chunk){
    //       rawHTML += chunk;
    //     });

    //     response.on("end", function(){
    //       process.stdout.write(rawHTML);
    //       process.stdout.write("\nprompt >");
    //     });

    //   }

    //   http.request(url, callback).end();
      
    // }

    curl: function(argv){
      var url = argv[0];
      request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
          process.stdout.write(body);
          process.stdout.write("\nprompt >");
        }
      });
    }
  }