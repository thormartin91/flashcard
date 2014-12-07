var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets,
	http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	subject = 'infosys';

// Create HTTP-server
http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888/');

// Connect to DB
mongo.connect('mongodb://127.0.0.1/flashcard', function(err, db) {
	if(err) throw err;

	// Establish connection with client
	client.on('connection', function(socket) {

		// Connect to collection
		var col = db.collection(subject);

		// Read flashcards from DB
		col.find().sort({_id:1}).toArray(function(err, res) {
			if(err) throw err;
			// Send result to client
			socket.emit('output', res, subject);
		});
	});
});