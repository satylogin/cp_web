window.onload = function() {
      setup();
}

var database;

// initial set up to set api key and connect to firebase database
function setup () {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA-xkqFfhWoi5opZP4QEXIeEplwxvuVUjI",
		authDomain: "web-quickstart-df6a6.firebaseapp.com",
		databaseURL: "https://web-quickstart-df6a6.firebaseio.com",
		projectId: "web-quickstart-df6a6",
		storageBucket: "web-quickstart-df6a6.appspot.com",
		messagingSenderId: "1051008299213"
	};

	firebase.initializeApp(config);

	// get a reference to the database
	database = firebase.database();
	
	firebase.auth().onAuthStateChanged(function(user) {
		
		if (user) {
			if (user.email != "satylogin@gmail.com" && user.email != "sarkysaurabh@gmail.com") {
				document.getElementById("post_solution").disabled = true;
			}

			try {
				document.getElementById("logged_state").innerHTML = user.email;
			} catch (err) {
				
			}
		} else {

		}
	});
	
	document.getElementById("post_solution").addEventListener('click', post_solution, false);
}

function post_solution() {
	var problem_link = document.forms["solutions"]["problem_link"].value;
	var explaination = document.forms["solutions"]["explaination"].value;
	var solution_link = document.forms["solutions"]["solution_link"].value;

	if (problem_link == "" || explaination == "" || solution_link == "") {
		alert("cannot leave anything blank.");
		return;
	}
	
	var date = new Date();
	var time_in_ms = date.getTime();
	time_in_ms /= 10;
	time_in_ms = 10000000000000000 - time_in_ms;
	//time_in_ms = -1 * time_in_ms;

	var ref = database.ref("blogs").child(time_in_ms);

	var data = {
		problem_link: problem_link,
		explaination: explaination,
		solution_link: solution_link
	}

	//console.log(data);

	ref.push(data);

	//console.log(data);
}