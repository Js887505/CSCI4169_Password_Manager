/*
A class to handle storing information about all currently logged in users
*/
const cryptography = require('./cryptography.js');
const crypto = require('crypto');

/*
A class for keeping track of and handling Users.
*/
class Users {
	constructor() {
		this.userList = {};//users stored as a key by their username
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
	}
}

/*
A user of the application
*/
class User {
	constructor(username,pass) {
		this.username = username;
		this.salt = crypto.randomBytes(64).toString('base64'); //store a salt for the password
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