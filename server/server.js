/*
Primary server file for running things and handling requests.

Author(s): Keith Pineo
*/
console.log("Loading server for Iron Man 2.")
//Node Modules
const express = require('express');
const cookieParser = require('cookie-parser');

//Modules written for this project
const config = require('./config.js');
const cryptography = require('./cryptography.js');
const users = require('./users.js');
const study = require('./study.js');

const app = express();
app.use(express.json()); //Allow JSON responses to be sent back.
app.use(cookieParser()); //Cookie parsing middleware

/*
A route for testing purposes. If this route is not responding then it is likely the server is offline.
*/
app.get('/is_the_server_responding_to_requests', async (req, res) => {
    res.json({
        'respondingToRequests': true
    });
});

app.get('/encryption_test', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const hashedIP = cryptography.SHA3(ip);
    const encryptedIP = cryptography.encryptTextAES256(ip);
    const decryptedIP = cryptography.decryptTextAES256(encryptedIP);

    const JSONObject = {'yourIPInSomeJSON':ip,'justARandomNumber':Math.random()};

    const encryptedJSON = cryptography.encryptJSONAES256(JSONObject);
    const decryptedJSON = cryptography.decryptJSONAES256(encryptedJSON);

    const UUID = cryptography.UUID();

    res.json({
        'ipAddress': ip,
        hashedIP,
        encryptedIP,
        decryptedIP,
        'JSONEncryptTest':JSONObject,
        encryptedJSON,
        decryptedJSON,
        UUID
    });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/pages/index.html');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/pages/login.html');
});

app.get('/register', function(req, res) {
  res.sendFile(__dirname + '/pages/register.html');
});
app.get('/showaccounts', function(req, res) {
    res.sendFile(__dirname + '/pages/ShowAccounts.html');
  });
//Study index page
app.get('/study', function(req, res) {
  res.sendFile(__dirname + '/pages/study_index.html');
});

//First page in the study
app.get('/study_register1', function(req, res) {
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
  res.sendFile(__dirname + '/pages/study_index.html');
});

app.listen(config.port);
console.log(config);
console.log(`Server load complete. The server is now listening for requests on port ${config.port}.`);

/*Handle gracefully shutting down the server.*/
process.on('SIGTERM', () => {
  console.log("SIGTERM signal received. Preparing to quit process.");
  process.exit(0);//This should also trigger process.exit();
});

process.on('SIGINT', () => {
  console.log("SIGINT signal received. Preparing to quit process.");
  process.exit(0);//This should also trigger process.exit();
});

process.on('exit', (code) => {
  shutdownApp();
});

function shutdownApp() {
  console.log("Preparing to shut down Iron Man 2 Server application.");
  //Save the study data
  study.saveStudyData();
  //Save extension user data
  users.saveUserData();
  //Quit the process
  console.log("Data should be saved at this point, exiting the server.")
}

module.exports = app;