
// to load when page start
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
	
	// check whether a user is logged in or not
	firebase.auth().onAuthStateChanged(function(user) {
		
		// if user logged in
		if (user) {
			// check for user admin access to post solution
			if (user.email != "satylogin@gmail.com" && 
				user.email != "sarkysaurabh@gmail.com" && 
				user.email != "admin@cp_web.com") {

				// if not admin then do not allow to post solution
				document.getElementById("post_solution").disabled = true;
			}

			// set register request to logged user email.
			try {
				document.getElementById("logged_state").innerHTML = user.email;
			} catch (err) {
				
			}
		} else {

		}
	});
	
	// set event listner for post solution button
	document.getElementById("post_solution").addEventListener('click', post_solution, false);
}

/*
 * Function to add solution to database.
 */
function post_solution() {

	// get problem name, problem link, explaination, and solution link from user.
	var problem_name = document.forms["solutions"]["problem_name"].value;
	var problem_link = document.forms["solutions"]["problem_link"].value;
	var explaination = document.forms["solutions"]["explaination"].value;
	var solution_link = document.forms["solutions"]["solution_link"].value;

	// check if any field is blank
	if (problem_name == "" || problem_link == "" || explaination == "" || solution_link == "") {
		alert("cannot leave anything blank.");
		return;
	}
	
	// get a ref to blogs child.
	var ref = database.ref("blogs");

	// create a data object
	var data = {
		problem_name: problem_name,
		problem_link: problem_link,
		explaination: explaination,
		solution_link: solution_link
	}

	// push data to database
	ref.push(data);
}