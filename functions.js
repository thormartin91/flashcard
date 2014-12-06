(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	},
	// Get required nodes
	subject = getNode('.flashcard-subject'),
	title = getNode('.flashcard-title'),
	description = getNode('.flashcard-description'),
	i = 0, // counter for cards
	data = [],

	// Define functions
	setSubject = function(s) {
		if(subject.hasChildNodes) {
			subject.removeChild(subject.lastChild);
		}
		var cardSubject = document.createElement('h1');
		cardSubject.textContent = s;
		subject.appendChild(cardSubject);
	},
	setTitle = function(t) {
		if(title.hasChildNodes) {
			title.removeChild(title.lastChild);
		}
		var cardTitle = document.createElement('h3');
		cardTitle.textContent = t;
		title.appendChild(cardTitle);
	},
	setDescription = function(d) {
		if(description.hasChildNodes) {
			description.removeChild(description.lastChild);
		}
		var cardDescription = document.createElement('p');
		cardDescription.textContent = d;
		description.appendChild(cardDescription);
		description.style.visibility = 'hidden';
	},
	isVisible = function(node) {
		if(document.defaultView.getComputedStyle(node,"").getPropertyValue('visibility') == 'hidden') {
			return false;
		} else return true;
	},
	nextCard = function(card) {
		setTitle(card.title);
		setDescription(card.description);
	};

	// connect to socket
	try {
		var socket = io.connect('http://127.0.0.1:8080');
	} catch(e) {
	}
	if(socket != undefined) {
		// Listen for output
		socket.on('output', function(rawdata, subject) {
			if(rawdata.length) {
				// Set subject header
				setSubject(subject);
				// Randomize the data-list
				data = rawdata.sort(function() { return 0.5 - Math.random() });
				// Make first card
				setTitle("Trykk hva som helst for å se ditt første kort");
				setDescription("Flott! Du kan også trykke deg bakover med pil til venstre eller backspace. Trykk en tast for å se neste kort!");
			};
		});
	};

	// Add eventlisteners
	document.addEventListener("click", next); // Mouse
	document.addEventListener("keydown", next); // Keyboard

	// NEXT-function
	function next(event) {
		if(event.metaKey) return; // Avoid CMD-button

		// BACKWARDS
		if(event.which == 37 || event.which == 8) { // leftarrow or backspace
			if(i == 0) {
				setTitle("Det var det første kortet! Trykk deg videre eller last inn siden på nytt for å starte med et tilfeldig kort");
				setDescription("");
			} else {
				i--;
				nextCard(data[i]);
			}

		// FORWARDS
		} if(!isVisible(description)) { 
			description.style.visibility = 'visible';
		} else if(i < data.length) {
			//next card
			setTitle(data[i].title);
			setDescription(data[i].description);
			i++;
		} else if(i == data.length) {
			setTitle("Det var det siste kortet! Trykk deg bakover eller last inn siden på nytt for å starte med et tilfeldig kort");
			setDescription("");
		}
	};
})();