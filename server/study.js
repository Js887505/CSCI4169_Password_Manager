/*
A class for handling participants and data for the study website.
Shares a lot of similarities with users.js

Author(s): Keith Pineo
*/
const fs = require('fs');

const cryptography = require('./cryptography.js');
const config = require('./config.js');

/*
All of the study data
*/
class Study {
	constructor() {
		//All participants in the study.
		this.participants = {};
		this.loadStudyData();
	}

	//Gets a participant.
	getParticipant(id) {
		return this.participants[id];
	}

	/*Returns a participant if it exists, otherwise makes a new participant*/
	acquireParticipant(id) {
		if (id && this.participants[id]) {
			return this.participants[id];
		}
		else {
			return this.newParticipant();
		}
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
		try {
			//Encrypt the data then store it
			fs.writeFileSync(config.studyDataFile,cryptography.encryptJSONAES256(this.participants),config.fileEncoding);
			console.log("Study data saved successfully.");
		}
		catch(err) {
			console.log("Error: Unable to save user data to file!");
			console.log(err);
		}
	}

	loadStudyData() {
		console.log("Init: Loading study data.")
		let rawStudyData;
		let fileError;
		try {
			rawStudyData = fs.readFileSync(config.studyDataFile,config.fileEncoding);
		}
		catch(err) {
			console.log(`Error: Unable to read study data from the file ${config.studyDataFile}`)
			console.log(err);
			fileError = err;
			return;//Can't load the data.
		}

		try {
			rawStudyData = cryptography.decryptJSONAES256(rawStudyData);
		}
		catch(err) {
			console.log("Error: Unable to decrypt study data.");
			console.log(err);
			return;
		}

		if (!rawStudyData) {
			//There was an error of some kind parsing the data and it could not be returned to JSON format, nothing more can be done
			console.log("Error: Something went wrong turning the study data back into JSON format.");
			console.log(rawStudyData);
			return;
		}

		//If it passes those previous steps it should be good to parse.
		console.log(rawStudyData);

		//Rebuild the participant data
		for(let id in rawStudyData) {
			this.participants[id] = Participant.fromJSON(rawStudyData[id]);
		}

		console.log("Init: Study data loaded.");
	}
}

/*
A single participant in the study
*/
class Participant {
	constructor(id,users,data) {
		this.id = id;//Unique ID for this participant
		this.users = users;//Array of users the participant is using to log into the study with
		this.data = data;//Data being tracked for the study, stored as a generic object
	}

	//Creates a new participant for the study
	static newParticipant() {
		return new Participant(cryptography.UUID(), [], {});
	}

	//Recreates the participant object from a basic JSON object
	static fromJSON(JSONObj) {
		console.log("Recreating participant");
		console.log(JSONObj);

		//Rebuild the user list
		let users = [];
		for(let u in JSONObj.users) {
			users.push(User.fromJSON(JSONObj.users[u]));
		}

		return new Participant(JSONObj.id,users,JSONObj.data);
	}

	//Returns a specific user the participant created for the study, they are indexed from 0 to 2 corresponding to which step of the login/register they are on.
	getUser(index) {
		if (index >= 0 && index < this.users.length) {
			return this.users[index];
		}
		else {
			return null;
		}
	}

	//Registers a user for a specific index
	addUser(username,pass,index) {
		this.users[index] = User.newUser(username,pass);

		return this.users[index];
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

	static newUser(username,pass) {
		//This user has not had a password hash generated yet.
		let salt = cryptography.getSalt(); //generate a salt for the password
		pass = cryptography.SHA3(pass,salt); //Then generate the password

		return new User(username,pass,salt);
	}

	static fromJSON(JSONObj) {
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