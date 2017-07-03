window.onload = function() {
      setup();
}

var database;
var user_name;
var user_email;
var user_id;
var email_verified;
var cf_id;
var ref;
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

//	var ref = database.ref("users");
//	ref = ref.child("satylogin");
//	var data = {
//		cf_id: "satylogin"
//	}
//	ref.push(data);
	
	firebase.auth().onAuthStateChanged(function(user) {
		
		if (user) {
			//console.log("user data", user);
			not_allow_login();
			get_user_data(user);
			fill_user_data();
			
			try {
				document.getElementById("logged_state").innerHTML = user_name;
			} catch (err) {
				
			}
		} else {
			//console.log(firebase.auth().currentUser);
			allow_login();
		}
	});
	
	add_event_listners();
}

/*
 * This function is used to sign up a new user using firebase method
 */
function sign_up() {
	
	// get the email and password that the user has entered
	var email = document.forms["sign"]["email"].value;
	var password = document.forms["sign"]["password"].value;
	
	if (email.search("@iiita.ac.in") == -1) {
		alert("Enter the college id");
		return;
	}

	// firebase readymade function for signup
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(err) {
		
		// in case any error occured
		var err_code = err.code;
		var err_msg = err.message;
		
		// showing error message to debug
		if (err_code == "auth/weak-password") {
			alert("Weak password");
		} else if (err_code == "auth/email-already-in-use") {
			alert("Email already in use");
		} else {
			alert(err_msg);
			console.log(err);
		}
	});
}

/*
 * This function is used to sign in an new user into the system
 */
function sign_in() {
	if (firebase.auth().currentUser) {
		sign_out();
	} else {
		// get the email and password the user has entered
		var email = document.forms["sign"]["email"].value;
		var password = document.forms["sign"]["password"].value;

		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(err) {
			// in case any error occured
			var err_code = err.code;
			var err_msg = err.message;

			// showing error message to debug
			if (err_code == "auth/wrong-password") {
				alert("Wrong password");
			} else {
				alert(err_msg);
				console.log(err);
			} 
			allow_login();
		});
										  
		not_allow_login();
	}
}

/*
 * This function is used to signout an existing user
 */ 
function  sign_out() {
	if (firebase.auth().currentUser) {
		// in case a user is logged in log him out
		firebase.auth().signOut().then(function() {
			alert("logged out");
			allow_login();
		}, function(err) {
			alert(err.message);
			not_allow_login();
		});
	}
}

function update_user_data() {
//	var user = firebase.auth().currentUser;
//
//	user.updateProfile({
//	  displayName: "Jane Q. User",
//	  photoURL: "https://example.com/jane-q-user/profile.jpg"
//	}).then(function() {
//	  // Update successful.
//	}, function(error) {
//	  // An error happened.
//	});

}

function update_email() {
	/*
	var user = firebase.auth().currentUser;

	user.updateEmail("user@example.com").then(function() {
	  // Update successful.
	}, function(error) {
	  // An error happened.
	});
	*/
}

function send_verification_mail() {
	var user = firebase.auth().currentUser;

	user.sendEmailVerification().then(function() {
	  // Email sent.
	  	alert("Email Sent. Check you inbox");
	}, function(error) {
	  // An error happened.
	  	alert("Ops! Some error happened." + error.message);
	});
}

function reset_password() {
	/*
	var user = firebase.auth().currentUser;
	var newPassword = getASecureRandomPassword();

	user.updatePassword(newPassword).then(function() {
	  // Update successful.
	}, function(error) {
	  // An error happened.
	});
	*/
}

function password_reset_email() {
	/*
	var auth = firebase.auth();
	var emailAddress = "user@example.com";

	auth.sendPasswordResetEmail(emailAddress).then(function() {
	  // Email sent.
	}, function(error) {
	  // An error happened.
	});
	*/
}

function re_authenticate_user() {
	/*
	var user = firebase.auth().currentUser;
	var credential;

	// Prompt the user to re-provide their sign-in credentials

	user.reauthenticate(credential).then(function() {
	  // User re-authenticated.
	}, function(error) {
	  // An error happened.
	});	
	*/
}

/*
 * This function is used to get basic data about
 * current logged in user and save that in global 
 * variables.
 */
function get_user_data(user) {
	if (user != null) {
		user_name = user.displayName;
		user_email = user.email;
		user_id = user.uid;
		email_verified = user.emailVerified;
		
		var i = 0;
		for (i = 0; i < user_email.length; ++i) {
			if (user_email.charAt(i) == '@') break;
		}
		
		user_name = user_email.substring(0, i);
	}
}

function fill_user_data() {
	var ref = database.ref("users/" + user_name);
	ref.on("value", get_data, get_err);
}

function get_data(data) {
	//console.log(data.val());
	
	var user = data.val();
	
	var cf_id = user.cf_id;
	var name = user.name;
	user_rating = user.rating;

	if (user_rating == undefined) user_rating = 1500;

	try {
		document.getElementById("user_details_name").value = name;
		document.getElementById("user_details_cf_id").value = cf_id;
	} catch (err) {
		
	}
}

function get_err(err) {
	colsole.log("error! ", err);
}

function submit_details() {
	var name = document.forms["user_details"]["user_details_name"].value;
	var cf_id = document.forms["user_details"]["user_details_cf_id"].value;
	
	var ref = database.ref("users/" + user_name);
	
	var data = {
		name: name,
		cf_id: cf_id,
		rating: user_rating
	}
	
	ref.set(data);
}

/*
 * Allow sign in and sign up and then disable signout
 */
function allow_login() {
	try {
		document.getElementById("sign_in_button").disabled = false;
		document.getElementById("sign_up_button").disabled = false;
		document.getElementById("sign_out_button").disabled = true;
		document.getElementById("send_verification_mail").disabled = true;
		document.getElementById("user_details").style.display = "none";

	} catch (err) {
		
	}
}

/*
 * disable signin and signup and enable signout
 */
function not_allow_login() {
	try {
		document.getElementById("sign_in_button").disabled = true;
		document.getElementById("sign_up_button").disabled = true;
		document.getElementById("sign_out_button").disabled = false;
		document.getElementById("send_verification_mail").disabled = false;
		document.getElementById("user_details").style.display = "block";
	} catch (err) {
		
	}
}

/*
 * Add all event listners here
 * ||
 * ||
 * \/
 */
function add_event_listners() {
	try {
		document.getElementById('sign_up_button').addEventListener('click', sign_up, false);
		document.getElementById('sign_in_button').addEventListener('click', sign_in, false);
		document.getElementById('sign_out_button').addEventListener('click', sign_out, false);
		document.getElementById('submit_details_button').addEventListener('click', submit_details, false);
		document.getElementById('send_verification_mail').addEventListener('click', send_verification_mail, false);
	} catch (err) {
		
	}
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

function retrive() { 
	
	// get a reference to users node from data base and
	// call the data in increasing order y their rating
	var ref = firebase.database().ref("users");
	
	// switch on a reference to get the data
	// get_data = function to get data and make table
	// get_err = in case of failure display message on
	// 	     console
	ref.on('value', get_data_table, get_err);
}

function get_data_table(data) {
	
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
		var user = users[keys[i]].name;
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
