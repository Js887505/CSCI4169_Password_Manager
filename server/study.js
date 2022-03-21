/*
A class for handling participants and data for the study website.
Shares a lot of similarities with users.js

Author(s): Keith Pineo
*/
const fs = require('fs');
const path = require('path');

const cryptography = require('./cryptography.js');
const config = require('./config.js');

const NO_FILE_ERROR_CODE = "ENOENT";

/*
All of the study data
*/
class Study {
	constructor() {
		//All participants in the study.
		this.participants = {};
	}

	getParticipant(id) {
		return this.participants[id];
	}

	//Create a new participant add them to the list of participants. Returns the new participant.
	newParticipant() {
		let temp = Participant.newParticipant();
		let id = temp.id;

		this.participants[id] = temp;

		return temp;
	}

	saveStudyData() {
		console.log("Saving study data");

		console.log("Study data saved");
	}
}

/*
A single participant in the study
*/
class Participant {
	constructor(id,users) {
		this.id = id;
		this.users = users;
	}

	//Creates a new participant for the study
	static newParticipant() {
		return new Participant(cryptography.UUID(), {});
	}

	//Recreates the participant object from a basic JSON object
	fromJSON() {
		
	}

	//Returns a specific user the participant created for the study
	getUser(username) {
		return this.users[username];
	}
}

/*
A User profile created for the test-login pages of the study. Each participant can have multiple user accounts associated with them.
*/
class User {
	constructor(username,pass,salt) {
		this.username = username;
		this.pass = pass;
		this.salt = salt;
	}

	newUser(username,pass) {
		//This user has not had a password hash generated yet.
		let salt = cryptography.getSalt(); //generate a salt for the password
		pass = cryptography.SHA3(pass,salt); //Then generate the password

		return new User(username,pass,salt);
	}

	fromJSON(JSONObj) {
		return new User(JSONObj.username,JSONObj.pass,JSONObj.salt);
	}

	//Check if the password of this user is valid, returns true if the password matches what is stored, false otherwise
	checkPassword(pass) {
		let submittedPass = cryptography.SHA3(pass,this.salt);

		if (submittedPass === this.pass) {
			return true;
		}
		else {
			return false;
		}
	}
}

study = new Study();

module.exports = study;