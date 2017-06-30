var database;

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

	database = firebase.database().ref();
}

function sign_up() {
	var email = document.forms["signup"]["email"].value;
	var cf_id = document.forms["signup"]["cf_id"].value;
	var cc_id = document.forms["signup"]["cc_id"].value;
	var he_id = document.forms["signup"]["he_id"].value;
	var hr_id = document.forms["signup"]["hr_id"].value;
	var at_id = document.forms["signup"]["at_id"].value;
	var cs_id = document.forms["signup"]["cs_id"].value;
	
	var request = database.child("user");
	
	var data = {
		"email": email,
		"cf_id": cf_id,
		"cc_id": cc_id,
		"he_id": he_id,
		"hr_id": hr_id,
		"at_id": at_id,
		"cs_id": cs_id
	}
	
	request.push(data);	
}