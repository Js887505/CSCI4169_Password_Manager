require.config({
  paths: {
      'crypto-js': '../bower_components/crypto-js/crypto-js'
  }
});

class extUsers {
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
}

/*
A user of the application
*/
class User {
	constructor(username,pass) {
		this.username = username;
    //Then generate the password
    this.pass = require(["crypto-js"], function(CryptoJS){
      console.log(pass);
      var hash = CryptoJS.SHA3(pass, { outputLength: 512});
      console.log(hash.toString());
      return hash.toString();
    });
    console.log(this);
  }

	//Check if the password of this user is valid, returns true if the password matches what is stored, false otherwise
	checkPassword(pass) {
		let submittedPass = require(["crypto-js"], function (CryptoJS){
      return CryptoJS.SHA3(pass, { outputLength: 512}).toString();
    });

    console.log(this.pass.toString() + " " + submittedPass.toString());
		
    if (submittedPass === this.pass) {
			return true;
		}
		else {
			return false;
		}
	}
}