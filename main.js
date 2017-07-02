var database;
var user_mail;
var mail_verified;


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
}


function init() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			document.getElementById("log_in_type").innerHTML = "<li><a href = 'login.html'><span class='glyphicon glyphicon-user'></span> LOGOUT " + user.email + " </a></li>"
			
			mail_verified = user.emailVerified;
			
		} else {
			document.getElementById("log_in_type").innerHTML = "<li><a href='login.html'><span class='glyphicon glyphicon-user'></span> LOGIN </a></li>"
		}
	});
}

function log_out_current_user() {
	console.log("in log out = ", firebase.auth().currentUser);
	if (firebase.auth().currentUser) {
		firebase.auth().signOut.then(function() {
			console.log("You are signed out.");
		}, function(error) {
			console.log("Error in sign out " + error);
			document.getElementsByTagName("body").innerHTML = "";
		});
	}
}

function sign_up() {
	var email = document.forms["signup"]["email"].value;
	var password = document.forms["signup"]["password"].value;

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(err) {
		var err_code = err.code;
		var err_message = err.message;
		
		if (err_code == 'auth/weak-password') {
			alert('The password is too weak.');
		} else {
		  	alert(err_message);
		}
		
		console.log(err);
	});	
}

function sign_in() {
	var user = firebase.auth().currentUser;
	console.log("before login = ", user);
	
	if (firebase.auth().currentUser) {
		firebase.auth().signOut().then(function() {
			console.log('Signed Out');
		}, function(error) {
			console.error('Sign Out Error', error);
		});
	} else {	
		var email = document.forms["signin"]["email"].value;
		var password = document.forms["signin"]["password"].value;

		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(err) {
			var err_code = err.code;
			var err_message = err.message;

			if (err_code == "auth/wrong-password") {
				alert("Wrong Password");
			} else {
				alert(err_message);
			}

			console.log(err);
		});

		console.log("inside function = ", firebase.auth().currentUser);
		user_mail = email;

	}
}

function fill_detail() {
	var cf_id = document.forms["detail"]["cf_id"].value;
	var cc_id = document.forms["detail"]["cc_id"].value;
	var he_id = document.forms["detail"]["he_id"].value;
	var hr_id = document.forms["detail"]["hr_id"].value;
	var at_id = document.forms["detail"]["at_id"].value;
	var cs_id = document.forms["detail"]["cs_id"].value;
	
	var ref = database.ref("users");
	
	var data = {
		email: user_mail, 
		cf_id: cf_id,
		cc_id: cc_id,
		he_id: he_id,
		hr_id: hr_id,
		at_id: at_id,
		cs_id: cs_id
	}
	
	ref.push(data).catch(function(err) {
		console.log(err);
	});
	
	document.getElementById("fill_detail").style.display = "none";
	document.getElementById("redirect").style.display = "block";
}

/*
 * This function is use to get all the user data from the 
 * database and then create a leader board using that data.
 */
function retrive() { 
	
	// get a reference to users node from data base and
	// call the data in increasing order y their rating
	var ref = database.ref("users").orderByChild("rating");
	
	// switch on a reference to get the data
	// get_data = function to get data and make table
	// get_err = in case of failure display message on
	// 	     console
	ref.on('value', get_data, get_err);
}


/*
 * This function is used to fill in the table (user leaderboard)
 * with all the users present in the database sorted in decending 
 * order by their rating. argument is the data object got by the 
 * database.
 */
function get_data(data) {
	
	// get the users from the object
	var users = data.val();
	
	// make an array of keys to loop through
	var keys = Object.keys(users);
	
	// get a reference to the table (leaderboard)
	var table = document.getElementById("user_list");
	
	// loop through all keys
	for (var i = 0; i < keys.length; ++i) {
		// get required data using key of a
		// data node.
		var user = users[keys[i]].email;
		var cf_id = users[keys[i]].cf_id;
		var cc_id = users[keys[i]].cc_id;
		var he_id = users[keys[i]].he_id;
		var hr_id = users[keys[i]].hr_id;
		var at_id = users[keys[i]].at_id;
		var cs_id = users[keys[i]].cs_id;
		var rating = users[keys[i]].rating;
		
		// create a new row at top of table
		var row = table.insertRow(0);
		
		// insert data into cells 
		row.insertCell(0).innerHTML = user;
		row.insertCell(1).innerHTML = get_cf_rating(cf_id);
		row.insertCell(2).innerHTML = cc_id;
		row.insertCell(3).innerHTML = he_id;
		row.insertCell(4).innerHTML = hr_id;
		row.insertCell(5).innerHTML = at_id;
		row.insertCell(6).innerHTML = cs_id;
		row.insertCell(7).innerHTML = rating;
	}
}

/*
 * This function is used to catch error
 */
function get_err(err) {
	console.log("Error!");
	console.log(err);
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