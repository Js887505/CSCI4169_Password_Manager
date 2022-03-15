var usernameField = document.getElementById("signupUsername");
var passwordField = document.getElementById("signupPassword");
var username, password;

document.getElementById("signupButton").addEventListener("click", signup);


function signup(){
  username = document.getElementById("signupUsername").value;
  password = document.getElementById("signupPassword").value;
  alert(username + " " + password);
}