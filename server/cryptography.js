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
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY_LENGTH = 32; //Length in characters
const ENCRYPTION_ENCODING = 'base64';

class Cryptography {
	constructor() {
		if (config.dataEncryptionKey.length != ENCRYPTION_KEY_LENGTH) {
			throw `Initialization Error: dataEncryptionKey has length ${config.dataEncryptionKey.length}, but it must be of length ${ENCRYPTION_KEY_LENGTH}`;
		}
	}

	//Returns a hex-formatted SHA3 hash from the passed in plaintext and salt.
	SHA3(plaintext, salt = "") {
		return crypto.createHash(HASH_ALGORITHM).update(plaintext + salt).digest('hex');
	}

	//Encrypts plaintext using AES-256 and returns the encrypted data in base64 format. Returns the IV concatenated with the encrypted text.
	encryptTextAES256(plaintext) {
		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, config.dataEncryptionKey, iv);
		let encryptedText = cipher.update(plaintext,'utf8', ENCRYPTION_ENCODING);
		encryptedText += cipher.final(ENCRYPTION_ENCODING);

		//Base 64 encoding does not have colons : as a possible character, use that to separate the text.
		return iv.toString(ENCRYPTION_ENCODING) + ":" + encryptedText;
	}

	//Decrypts AES-256 encrypted plaintext and returns the text. Returns null if an IV or encrypted string are not found
	decryptTextAES256(encryptedString) {
		//IV and data are separated by a colon.
		encryptedString = encryptedString.split(':');

		//Return nothing if an IV or encrypted string are not present.
		if (encryptedString.length != 2 || !encryptedString[0] || !encryptedString[1]) {
			return null;
		}

		let iv = Buffer.from(encryptedString[0], ENCRYPTION_ENCODING);
		encryptedString = encryptedString[1];

		let decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, config.dataEncryptionKey, iv);
		let decipheredText = decipher.update(encryptedString, ENCRYPTION_ENCODING,'utf8');
		decipheredText += decipher.final('utf8')

		return decipheredText;
	}

	//Encodes a JavaScript object into JSON then encrypts the resulting text.
	encryptJSONAES256(ObjectToEncrypt) {
		let JSONtext = JSON.stringify(ObjectToEncrypt);
		return this.encryptTextAES256(JSONtext);
	}

	//Decrypts AES-256 encrypted JSON text and recreates the JavaScript object from that text. 
	//Returns the recreated object if successful.
	//Returns an empty object {} if there is an error parsing the JSON.
	decryptJSONAES256(JSONToDecrypt) {
		let JSONObject = {};
		try {
			let JSONText = this.decryptTextAES256(JSONToDecrypt);
			JSONObject = JSON.parse(JSONText);
		}
		catch(err) {
			console.log(err);
			JSONObject = {};
		}

		return JSONObject;
	}
}

cryptography = new Cryptography();

module.exports = cryptography;