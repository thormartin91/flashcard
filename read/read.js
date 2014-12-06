// This file reads the content of 'file.txt' into flashcard.infosys
// The structure of 'file.txt' should be:
// title - description  \n  title - description
// MongoDB currently running at localhost

var fs = require('fs'), 
	filename = 'infosys.txt',
	mongo = require('mongodb').MongoClient
  ;
// Connect to DB
mongo.connect('mongodb://127.0.0.1/flashcard', function(err, db) {
	if(err) throw err;

	// connect to collection
	var col = db.collection('infosys');

	// Read file  
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) throw err;

		var listOfData = data.toString().split('\n')
		for(var i in listOfData) {
			var array = listOfData[i].split(' - '),
				title = array[0],
				description = array[1];

			// Insert to DB
			col.insert({title: title, description: description}, function() {});
			console.log('Inserted: ', title, ' - ', description);
		};
	});
});