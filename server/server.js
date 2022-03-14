/*
Primary server file for running things and handling requests.

Author(s): Keith Pineo
Ty Fetinko
*/
console.log("Loading server for Iron Man 2.")
//Node Modules
const express = require('express');

//Modules written for this project
const config = require('./config.js');
const cryptography = require('./cryptography.js');

const app = express();
app.use(express.json()); //Allow JSON responses to be sent back.

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

    res.json({
        'ipAddress': ip,
        hashedIP,
        encryptedIP,
        decryptedIP,
        'JSONEncryptTest':JSONObject,
        encryptedJSON,
        decryptedJSON
    });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/pages/index.html');
});
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/pages/Login.html');
  });
  app.get('/regster', function(req, res) {
    res.sendFile(__dirname + '/pages/Register.html');
  });


app.listen(config.port);

console.log(config)

console.log(`Server load complete. The server is now listening for requests on port ${config.port}.`);