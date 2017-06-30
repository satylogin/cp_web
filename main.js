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

	database = firebase.database();
}

function sign_up() {
	var email = document.forms["signup"]["email"].value;
	var cf_id = document.forms["signup"]["cf_id"].value;
	var cc_id = document.forms["signup"]["cc_id"].value;
	var he_id = document.forms["signup"]["he_id"].value;
	var hr_id = document.forms["signup"]["hr_id"].value;
	var at_id = document.forms["signup"]["at_id"].value;
	var cs_id = document.forms["signup"]["cs_id"].value;
	
	var req = database.ref();
	var request = req.child("request");
	
	var data = {
		"email": email,
		"cf_id": cf_id,
		"cc_id": cc_id,
		"he_id": he_id,
		"hr_id": hr_id,
		"at_id": at_id,
		"cs_id": cs_id, 
		"rating": 1500
	}
	
	request.push(data);	
}

function retrive() { 
	var ref = database.ref("users");
	ref.on('value', get_data, get_err);
}

function get_data(data) {
	console.log(data.val());
	var users = data.val();
	var keys = Object.keys(users);
	var par = document.getElementById("user_list");
	for (var i = 0; i < keys.length; ++i) {
		var user = users[keys[i]].email;
		var cf_id = users[keys[i]].cf_id;
		var cc_id = users[keys[i]].cc_id;
		var he_id = users[keys[i]].he_id;
		var hr_id = users[keys[i]].hr_id;
		var at_id = users[keys[i]].at_id;
		var cs_id = users[keys[i]].cs_id;
		var rating = users[keys[i]].rating;
		
		var list = document.createElement("tr");
		var child, text;
		
		child = document.createElement("td");
		text = document.createTextNode(user);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(get_cf_rating(cf_id));
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(cc_id);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(he_id);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(hr_id);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(at_id);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(cs_id);
		child.appendChild(text);
		list.appendChild(child);
		child = document.createElement("td");
		text = document.createTextNode(rating);
		child.appendChild(text);
		list.appendChild(child);
		
		par.appendChild(list);
	}
}

function get_err(err) {
	console.log("Error!");
	console.log(err);
}

function get_cf_rating(handle) {
	var url = "http://codeforces.com/api/user.info?handles="+handle;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	
	var data = JSON.parse(xhr.response);
	
	return data.result[0].rating;
}