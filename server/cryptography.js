/*
A class with for handling common cryptography tasks. 

This mostly just exists to provide easy to use wrappers around Node's built in crypto module.

Author(s): Keith Pineo
*/
//Node Modules
const crypto = require('crypto');
//Modules written for this project
const config = require('./config.js');

const IV_LENGTH = 16; //Initialization vector length
const HASH_ALGORITHM = 'sha3-512';
const HASH_ENCODING = 'base64';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY_LENGTH = 32; //Length in characters
const ENCRYPTION_ENCODING = 'base64';

class Cryptography {
	constructor() {
		if (config.dataEncryptionKey.length != ENCRYPTION_KEY_LENGTH) {
			throw `Initialization Error: dataEncryptionKey has length ${config.dataEncryptionKey.length}, but it must be of length ${ENCRYPTION_KEY_LENGTH}`;
		}
		else if (config.dataEncryptionKey == config.exampleEncryptionKey) {
			console.warn("**********WARNING*********");
			console.warn("Warning: AES Encryption Key Not Set. You are currently using the example encryption key in env.example.");
			console.warn("This is fine for testing purposes but NOT OKAY FOR DEPLOYMENT.")
		}
	}

	//Generates a plaintext salt in base64 format that can be used for other purposes.
	getSalt(numBytes = 32) {
		return crypto.randomBytes(numBytes).toString('base64');
	}

	//Returns a base-64 formatted SHA3 hash from the passed in plaintext and salt.
	SHA3(plaintext, salt = "") {
		return crypto.createHash(HASH_ALGORITHM).update(plaintext + salt).digest(HASH_ENCODING);
	}

	//Just a wrapper for crypto's UUID generator so files don't need to include both this one and crypto
	UUID() {
		return crypto.randomUUID();
	}

	//Encrypts plaintext using AES-256 and returns the encrypted data in base64 format. Returns the IV concatenated with the encrypted text.
	encryptTextAES256(plaintext, encryptionKey = config.dataEncryptionKey) {
		if (!plaintext) {
			return null;
		}

		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
		let encryptedText = cipher.update(plaintext,'utf8', ENCRYPTION_ENCODING);
		encryptedText += cipher.final(ENCRYPTION_ENCODING);

		//Base 64 encoding does not have colons : as a possible character, use that to separate the text and IV.
		return iv.toString(ENCRYPTION_ENCODING) + ":" + encryptedText;
	}

	//Decrypts AES-256 encrypted plaintext and returns the text. Returns null if an IV or encrypted string are not found
	decryptTextAES256(encryptedString, encryptionKey = config.dataEncryptionKey) {
		if (!encryptedString) {
			return null;//Nothing to decrypt
		}

		//IV and data are separated by a colon.
		encryptedString = encryptedString.split(':');

		//Return nothing if an IV or encrypted string are not present.
		if (encryptedString.length != 2 || !encryptedString[0] || !encryptedString[1]) {
			return null;
		}

		let iv = Buffer.from(encryptedString[0], ENCRYPTION_ENCODING);
		encryptedString = encryptedString[1];

		let decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, encryptionKey, iv);
		let decipheredText = decipher.update(encryptedString, ENCRYPTION_ENCODING,'utf8');
		decipheredText += decipher.final('utf8')

		return decipheredText;
	}

	//Encodes a JavaScript object into JSON then encrypts the resulting text.
	//Returns null if there is nothing to encrypt, otherwise returns the encrypted text.
	encryptJSONAES256(objectToEncrypt) {
		if (!objectToEncrypt) {
			return null;
		}

		let JSONtext = JSON.stringify(objectToEncrypt);
		return this.encryptTextAES256(JSONtext);
	}

	//Decrypts AES-256 encrypted JSON text and recreates the JavaScript object from that text. 
	//Returns the recreated object if successful.
	//Returns null if there is an error parsing the JSON.
	decryptJSONAES256(JSONToDecrypt) {
		if (!JSONToDecrypt) {
			return null;
		}


		let JSONObject = {};
		try {
			let JSONText = this.decryptTextAES256(JSONToDecrypt);
			JSONObject = JSON.parse(JSONText);
		}
		catch(err) {
			console.log(err);
			return null;
		}

		return JSONObject;
	}

	//Encrypt a basic JSON object for storage in a cookie.
	//This uses a different encryption key than the one storing data on the server.
	//Also appends a timestamp and some random data into the cookie to help prevent session jacking.
	encryptCookieData(objectToEncrypt) {
		if (objectToEncrypt === undefined || objectToEncrypt === null) {
			return null;
		}

		let cookie = {
			"data":objectToEncrypt,
			"timestamp": Date.now(),
			"random": Math.random()
		};

		let JSONtext = JSON.stringify(cookie);

		return this.encryptTextAES256(JSONtext, config.cookieEncryptionKey);
	}

	decryptCookieData(JSONToDecrypt) {
		if (!JSONToDecrypt) {
			return null;//Nothing to decrypt
		}

		let JSONObject = {};
		try {
			let JSONText = this.decryptTextAES256(JSONToDecrypt, config.cookieEncryptionKey);
			JSONObject = JSON.parse(JSONText);
		}
		catch(err) {
			console.log("Error: Unable to decrypt a cookie.")
			console.log(err);
			return null;
		}

		return JSONObject.data;
	}
}

cryptography = new Cryptography();

module.exports = cryptography;