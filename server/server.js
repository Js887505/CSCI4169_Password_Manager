/*
Primary server file for getting things initialized.

Author(s): Keith Pineo
*/
console.log("Loading server for Iron Man 2.")
const express = require('express');
const config = require('./config.js');

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

app.listen(config.port);

console.log(config)

console.log(`Server load complete. The server is now listening for requests on port ${config.port}.`)