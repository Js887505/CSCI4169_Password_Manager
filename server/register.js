const config = require('./config.js');
const cryptography = require('./cryptography.js');
const users = require('./users.js');
const app = require('./server.js');

app.post('/register_data', function(req, res) {
  console.log(req);
  //Check if the user has been registered yet
});