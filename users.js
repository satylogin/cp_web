window.onload = function() {
      setup();
}

var database;
var user_name;
var user_email;
var user_id;
var email_verified;
var cf_id;
var user_rating;

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

	// fill the user list
	retrive();
	
	firebase.auth().onAuthStateChanged(function(user) {
		
		if (user) {
			try {
				document.getElementById("logged_state").innerHTML = user.email;
			} catch (err) {
				
			}
		} else {
			
		}
	});
}

/*
 * This function is used to get the codeforces rating of an user
 * using the cf api. The agrument if cf handle. Return value is 
 * rating.
 */
function get_cf_rating(handle) {
	var url = "http://codeforces.com/api/user.info?handles="+handle;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	
	var data = JSON.parse(xhr.response);
	
	return data.result[0].rating;
}

/*
 * This function is used to get the topcoder rating of an user
 * using the tc api. The agrument if tc handle. Return value is 
 * rating.
 */
function get_tc_rating(handle) {
	var url = "http://api.topcoder.com/v2/users/"+handle;
	//var url = "http://api.topcoder.com/v2/users/"+"satylogin";
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	
	var data = JSON.parse(xhr.response);
	
	//console.log(data.ratingSummary[0].rating);
	return data.ratingSummary[0].rating;
}

function retrive() { 
	
	// get a reference to users node from data base and
	// call the data in increasing order y their rating
	var ref = firebase.database().ref("users");
	
	// switch on a reference to get the data
	// get_data_table = function to get data and make table
	// get_err = in case of failure display message on
	// 	     console
	ref.on('value', get_data_table, get_err);
}

function get_data_table(data) {
	
	// get the users from the object and clear previous table
	document.getElementById("user_list").innerHTML = "";
	var users = data.val();

	console.log(users);
	
	// make an array of keys to loop through
	var keys = Object.keys(users);
	
	// get a reference to the table (leaderboard)
	var table = document.getElementById("user_list");
	
	// loop through all keys
	for (var i = 0; i < keys.length; ++i) {
		// get required data using key of a
		// data node.
		var user = users[keys[i]].name;
		var cf_id = users[keys[i]].cf_id;
		var tc_id = users[keys[i]].tc_id;
		var rating = users[keys[i]].rating;
		
		// create a new row at top of table
		var row = table.insertRow(0);
		
		// insert data into cells 
		row.insertCell(0).innerHTML = user;
		row.insertCell(1).innerHTML = get_cf_rating(cf_id);
		row.insertCell(2).innerHTML = get_tc_rating(tc_id);
		row.insertCell(3).innerHTML = rating;
	}
}

function get_err(err) {
	console.log(err);
}