/*
Classes to handle storing information about all currently logged in users
*/
const fs = require('fs');
const path = require('path');

const cryptography = require('./cryptography.js');
const config = require('./config.js');

const NO_FILE_ERROR_CODE = "ENOENT";

/*
A class for keeping track of and handling Users.
*/
class Users {
	constructor() {
		this.userList = {};//users stored as a key by their username
		config.userDataFilePath = path.resolve(__dirname);//Get the absolute path for reading and writing files.

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

	//Loads userData on initialization. This is asynchronous to reduce callback stuff, this only ever runs on load anyways.
	async loadUserData() {
		//config.userDataFile
		console.log(`Loading User data from ${config.userDataFilePath}`);
		let result = null;
		let errorCode = null;
		try {
			result = await fs.promises.access(config.userDataFilePath,fs.constants.R_OK | fs.constants.W_OK);
		}
		catch(err) {
			console.log(err);
			errorCode = err.code;//Keep the code to decide what to do next.
		}
		
		if (errorCode === NO_FILE_ERROR_CODE) {
			//file doesn't exist yet. Save the empty list to the file.
			users.saveUserData();
			return;
		}
		else if (errorCode != null) {
			throw "Initialization Error: unable to read/write userDataFile, but it does already exist. Please check file permisions.";
		}
		else {
			//No errors accessing the file, read it.
			const rawUserData = fs.readFileSync(config.userDataFilePath,config.fileEncoding);
			console.log("User data found and loaded, parsing now.");
			
			try {
				//Decrypt the JSON, parse it, then turn it back into User objects.
				const userData = cryptography.decryptJSONAES256(rawUserData);
				for (let key in userData) {
					this.userList[key] = new User(userData[key].username,userData[key].pass,userData[key].salt);
				}
			}
			catch(err) {
				console.log(err);
				throw `Initialization Error: unable to parse the user data JSON from the file ${config.userDataFilePath}`;
			}

			console.log("User data loaded and parsed successfully. It is now ready.");
		}
	}

	//Saves userlist to file occasionally
	async saveUserData() {
		console.log("Saving user data.");
		let result = null;
		let errorCode = null;
		try {
			result = await fs.promises.access(config.userDataFilePath,fs.constants.R_OK | fs.constants.W_OK);
		}
		catch(err) {
			console.log(err);
			errorCode = err.code;//Keep the code to decide what to do next.
		}

		console.log(JSON.stringify(this.userList));
		console.log(this.userList);

		if (errorCode === NO_FILE_ERROR_CODE || !errorCode) {
			//file doesn't exist yet, or there is no error. In either case it is okay to save the data.
			try {
				//Encrypt the data then store it
				fs.writeFileSync(config.userDataFilePath,cryptography.encryptJSONAES256(this.userList),config.fileEncoding);
				console.log("User data saved successfully.");
			}
			catch(err) {
				console.log("Error: Unable to save user data to file!");
				console.log(err);
			}
		}
		else {
			console.log("Error: Unable to save user data to file due to an unknown cause. ");
		}
	}
}

/*
A user of the application
*/
class User {
	constructor(username,pass,salt=null) {
		this.username = username;
		if (!salt) {
			//This user has not had a password hash generated yet.
			this.salt = cryptography.getSalt(); //generate a salt for the password
			this.pass = cryptography.SHA3(pass,this.salt); //Then generate the password
		}
		else {
			//Chances are this User was just loaded from a file or database and thus should use the stored data.
			this.pass = pass;
			this.salt = salt;
		}
		
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

var users = new Users();

module.exports = users;