const config = require('./config.js');
const cryptography = require('./cryptography.js');
const app = require('./server.js');

app.post('/login_data', function(req, res) {
  console.log(req);
  
});