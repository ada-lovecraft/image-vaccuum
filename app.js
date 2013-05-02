var google = require('node-google-api')('<apiKey>');
var sys = require('sys')
, http = require('http')
, fs = require('fs')
, query = "cat"
, numResults = 100; //multiples of 10

google.build(function(api) {
    var search = api.customsearch;
    fs.exists(query, function (exists) {
    	if (!exists)
    		fs.mkdirSync(query);
	    for (var start = 1; start <= numResults +1; start+=10) {
	    	console.log(start);
		    search.cse.list({searchType:'image', q: query, cx: '<searchEngineId>', start: start},function(gResults) {
		    	try {

			        gResults.items.forEach(function(result) {
			            //grab the file name for local saving
			            var filename = result.link.match(/\w+.\w+$/);
			            //check to see if the file exists locally, so that we don't just absolutely hammer imgur
			            fs.exists(query+'/'+filename, function(exists) {	
			            	if (!exists) {
				            	var imageRequest = http.get(result.link, function(imageResults) {
					                var imagedata ='';
					                imageResults.setEncoding('binary');
					                
					                imageResults.on('data', function(chunk) {
					                    imagedata += chunk;
					                }); // end imageResults data

					                imageResults.on('end', function() {
					                    fs.writeFile(query + '/' + filename[0],imagedata, 'binary', function(err) {
					                            if (err) throw err
					                            console.log(filename + ' saved');
					                    });
					                }); 
					            }); 
					        } else 
					        	console.log(filename + " already exists");
				        }); 
			        }); 

			    } catch(e) {
			    	console.log(e);
			    	console.log(sys.inspect(gResults.error.errors));
			    }
		    });
		} 
	}); 
}); 





