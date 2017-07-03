window.onload = function() {
      setup();
}

var database;
var last_end, last_start;

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
			try {
				document.getElementById("logged_state").innerHTML = user.email;
			} catch (err) {
				
			}
			last_end = 0;
			get_posts();
		} else {

		}
	});
	
	// document.getElementById("next").addEventListener('click', get_posts, false);
	// document.getElementById("next").addEventListener('click', get_prev, false);
}

function get_prev() {
	last_end = last_start-10;
	get_posts();
}

function get_posts() {
	var start = String(last_end+1);

	//var ref = database.ref("blogs").orderByKey().startAt(start).limitToFirst(10);
	var ref = database.ref("blogs").orderByKey();
	ref.on('value', get_data, get_err);
}

function get_data(data) {
	document.getElementById("solution_list").innerHTML = "";

	//console.log(data.val());
	var users = data.val();
	
	// make an array of keys to loop through
	var keys = Object.keys(users);

	// last_end = parseInt(keys[0]);
	// last_start = parseInt(keys[keys.length - 1]);

	// console.log("last start = ", last_start);
	// console.log("last end = ", last_end);

	// get a reference to the table (leaderboard)
	var table = document.getElementById("solution_list");
	
	// loop through all keys
	for (var i = 0; i < keys.length; ++i) {
		// get required data using key of a
		// data node.
		var user = users[keys[i]];
		var key = Object.keys(user);
		
		var problem_link = user[key[0]].problem_link;
		var explaination = user[key[0]].explaination;
		var solution_link = user[key[0]].solution_link;
		
		// create a new row at top of table
		var row = table.insertRow(i);
		
		// insert data into cells 
		row.insertCell(0).innerHTML = "<a href = '" + problem_link + "'> " + "problem_link" + " </a> ";
		row.insertCell(1).innerHTML = explaination;
		row.insertCell(2).innerHTML = "<a href = '" + solution_link + "'> " + "solution_link" + " </a> ";
	}
}

function get_err(err) {
	console.log("error in index.html in getting data", err);
}