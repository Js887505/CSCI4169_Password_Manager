/*
A class for defining route handling functions to keep server.js from getting all cluttered up
*/
const config = require('./config.js');
const cryptography = require('./cryptography.js');
const study = require('./study.js');

class StudyRouteHandler {
	static registerPage1(req, res) {
	//The participant ID is stored in the cookie and used for keeping track of sessions
	  let participant;
	  if (req?.cookies[config.studyCookieName]) {
	    console.log("Existing connection");
	    let id = cryptography.decryptCookieData(req.cookies[config.studyCookieName]);
	    participant = study.acquireParticipant(id);
	  }
	  else {
	    participant = study.newParticipant();
	    
	  }

	  //Either a new participant will be created or an existing one grabbed, either way the cookie should be updated before being send back.
	  console.log(participant);
	  res.cookie(config.studyCookieName, cryptography.encryptCookieData(participant.id));
	  res.sendFile(__dirname + '/pages/study_register1.html');
	}
}

module.exports = StudyRouteHandler;