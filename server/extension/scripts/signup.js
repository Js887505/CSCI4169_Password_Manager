const usersScript = require('../../users.js');

var usernameField = document.getElementById("signupUsername");
var passwordField = document.getElementById("signupPassword");
var username, password;

document.getElementById("signupButton").addEventListener("click", signup);


function signup(){
  user.createUser(document.getElementById("signupUsername").value, document.getElementById("signupPassword").value);
  user.saveUserData();
}