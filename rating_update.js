// to load when page start
window.onload = function() {
      setup();
}

var database;
var arr;

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

			// set register request to logged user email.
			try {
				document.getElementById("logged_state").innerHTML = user.email;
				user_name = user.email.split("@iiita.ac.in")[0];
			} catch (err) {
				
			}
		} else {

		}
	});


	document.getElementById("rank_list").addEventListener('change', function() {
		var fr = new FileReader();
		fr.onload = function() {
			arr = this.result;
			calculate_user_rating();
		}
		fr.readAsText(this.files[0]);
	});
}


function new_rating(Ra, Rb) {

	// Expected score of A
	var Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
	
	var Sa = 0;

	// actual score a A
	if (Ea > Eb) {
		Sa = 1;
	} else if (Ea == Eb) {
		Sa = 0.5;
	}

	// new Rating of A
	Ra = Ra + K * (Sa - Ea);

	return Ra;
}

function calculate_user_rating() {
	var tmp = arr.split(" ");

	for (var i = 0; i < tmp.length; ++i) {
		var ref = database.ref("users/" + tmp[i].split("@iiita.ac.in")[0]);
		ref.on('value', get_data, get_err);
	}

}

function get_data(data) {

	// user if not registered
	if (data.val() == null) {
		return;
	}

	var keys = Object.keys(data.val());

	console.log(data.val().rating);
}

function get_err(err) {
	console.log(err);
}