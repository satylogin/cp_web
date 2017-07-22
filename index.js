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
			try {
				document.getElementById("logged_state").innerHTML = user.email;
			} catch (err) {
				
			}
			get_posts();
		} else {

		}
	});
}

function get_posts() {
	var ref = database.ref("blogs");
	ref.on('value', get_data, get_err);
}

function get_data(data) {
	document.getElementById("solution_list").innerHTML = "";
	
	// ref to all posts.
	var posts = data.val();

	// uncomment to delete all data
	// var ref = database.ref("blogs");
	// ref.remove(function(err) {
	// 	alert(err);
	// });
	
	// make an array of keys to loop through
	var keys = Object.keys(posts);

	// get a reference to the table (leaderboard)
	var board = document.getElementById("solution_list");
	
	// loop through all keys
	for (var i = 0; i < keys.length; ++i) {
		//console.log(posts[keys[i]]);

		var problem_name = posts[keys[i]]["problem_name"];
		var problem_link = posts[keys[i]]["problem_link"];
		var solution_link = posts[keys[i]]["solution_link"];
		var explaination = posts[keys[i]]["explaination"];

		var div = document.createElement("div");
		div.setAttribute("class", "panel panel-info");
		
		var head = document.createElement("h3");
		head.setAttribute("class", "panel-title")

		var div1 = document.createElement("div");
		div1.setAttribute("class", "panel-heading post-heading");

		var div2 = document.createElement("div");
		div2.setAttribute("class", "panel-body blog-post");

		
		var head_data = document.createTextNode(problem_name);
		
		var exp_data = document.createTextNode(explaination);
		var prob = document.createTextNode(problem_link);
		var sol = document.createTextNode(solution_link);

		head.appendChild(head_data);
		div1.appendChild(head);

		div2.appendChild(prob);
		div2.appendChild(document.createElement("br"));
		div2.appendChild(exp_data);
		div2.appendChild(document.createElement("br"));
		div2.appendChild(sol);

		div.appendChild(div1);
		div.appendChild(div2);

		board.appendChild(div);
	}
}

function get_err(err) {
	console.log("error in index.html in getting data", err);
}