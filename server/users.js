/*
Classes to handle storing information about all currently logged in users
*/
const crypto = require('crypto');
const fs = require('fs');

const cryptography = require('./cryptography.js');
const config = require('./config.js');

const NO_FILE_ERROR_CODE = "ENOENT";

/*
A class for keeping track of and handling Users.
*/
class Users {
	constructor() {
		this.userList = {};//users stored as a key by their username

		this.loadUserData();
	}

	//Returns true if the user exists, false otherwise
	userExists(username) {
		if (this.userList[username]) {
			return true;
		}
		else {
			return false;
		}
	}

	//Returns the given user if it exists, undefined otherwise.
	getUser(username) {
		return this.userList[username];
	}

	//Creates a new user and adds it to the object keeping track of things
	createUser(username,password) {
		if (this.userExists(username)) {
			return false;//user already exists
		}

		let newUser = new User(username,password);
		this.userList[username] = newUser;

		return newUser;
	}

	//Deletes a user. Returns true if it succeeds, false otherwise.
	deleteUser(username) {
		if (!this.userExists(username)) {
			return false;//user does not exist
		}
		
		try {
			delete this.userList[username];
		}
		catch(err) {
			console.log(err);
			console.log(`There was an error deleting a user ${username}. The user should have been deleted however.`);
		}

		return true;
	}

	//Saves userlist to file occasionally
	saveUserData() {

	}

	//Loads userData on initialization. This is asynchronous to reduce callback stuff, this only ever runs on load anyways.
	async loadUserData() {
		//config.userDataFile
		console.log(`Loading User data from ${config.userDataFile}`);
		let result = null;
		let errorCode = null;
		try {
			result = await fs.promises.access(config.userDataFile,fs.constants.R_OK | fs.constants.W_OK);
		}
		catch(err) {
			console.log(err);
			errorCode = err.code;//Keep the code to decide what to do next.
		}
		
		if (errorCode === NO_FILE_ERROR_CODE) {
			//file doesn't exist yet, this is an easy fix, create the file.
		}
		else if (errorCode != null) {
			throw "Initialization error: unable to read/write userDataFile, but it does already exist. Please check file permisions.";
		}
		else {
			//No errors accessing the file, read it.
			
		}
	}
}

/*
A user of the application
*/
class User {
	constructor(username,pass) {
		this.username = username;
		this.salt = cryptography.getSalt(); //generate a salt for the password
		this.pass = cryptography.SHA3(pass,this.salt);
	}

	//Check if the password of this user is valid
	checkPassword(username,pass) {
		let submittedPass = cryptography.SHA3(pass,this.salt);

		if (submittedPass === this.pass) {
			return true;
		}
		else {
			return false;
		}
	}
}

var users = new Users();

module.exports = users;