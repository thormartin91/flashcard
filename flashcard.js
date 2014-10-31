var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;

// Connect to DB
mongo.connect('mongodb://127.0.0.1/flashcard', function(err, db) {
	if(err) throw err;

	// Establish connection with client
	client.on('connection', function(socket) {

		// Connect to collection
		var col = db.collection('infosys');

		// Read flashcards from DB
		col.find().limit(100).sort({_id:1}).toArray(function(err, res) {
			if(err) throw err;
			// Send result to client
			socket.emit('output', res);
		});
	});
});