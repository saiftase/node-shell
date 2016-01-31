var fs = require('fs');
var http = require('http');
var request = require('request');

module.exports = {
  	pwd: function(argv, done){
  		done(process.cwd());
  	},
  	date: function(argv, done){
  		var d = new Date();
      done(d.toString());
  	},
  	ls: function(argv, done){
      var output = "";
  		fs.readdir('.', function(err, files){
  			if(err) throw err;
  			files.forEach(function(file, idx, files){
  				output += file.toString();
          if(idx + 1 !== files.length){
            output += "\n";
          }
  			});
  			done(output);
  		});
  	},
  	echo: function(argv, done) {
  		var stringoutput = argv.join(' ');
      done(stringoutput);
  	},
  	cat: function(argv, done) {
  		var output = "";
  		argv.forEach(function(currentValue, idx, argv) {
  			output += fs.readFileSync(currentValue, 'utf-8');
        if(idx + 1 !== argv.length){
          output += "\n";
        }
  		});
  		done(output);
  		
  	},

  	head: function(argv, done) {
  		var string = "";
  		var lines = "";
  		var linesArr;
  		var fiveLines = "";
  		argv.forEach(function(currentValue, idx, argv) {
  			string += fs.readFileSync(currentValue, 'utf-8') + "\n";
  			linesArr = string.split("\n");
  			var limit = linesArr.length < 5 ? linesArr.length : 5;
  			for(var i = 0; i < limit; i++){
  				 fiveLines += linesArr[i];
           if(i + 1 !== limit){
            fiveLines += "\n";
          }
  			}
  		});
  		done(fiveLines);
  	},

  	tail: function(argv, done) {

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

  	sort: function(argv, done){
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

  		done(output);
  	},

  	wc: function(argv, done) {
  		var filename = argv[0],
  			output;

  		output = fs.readFileSync(filename,'utf-8');
  		output = output.split('\n');

  		done(output.length + "");
  	},

  	uniq: function(argv, done){
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


  		done(output.join("\n"));
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

    curl: function(argv, done){
      var url = argv[0];
      request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
          done(body);
        }
      });
    },

    find: function(argv, done){
      var path = argv[0];
      var output = "";
      fs.readdir(path, function(err, files){
        if(err) throw err;
        files.forEach(function(file, idx, files){
          if(file.indexOf(".") !== -1 && file.indexOf(".") !== 0){
            output += file.toString();
            if(idx + 1 !== files.length){
              output += "\n";
            } 
          }else{
            module.exports.find(path + file.toString, done);
          }
          
        });
        done(output);
      });
    }

  }