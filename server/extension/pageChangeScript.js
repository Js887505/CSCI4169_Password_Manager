var mainSection = document.getElementById("signupOrLoginSection");
var buttonsDiv = document.getElementById("signupOrLoginButtons");
var signupDiv = document.getElementById("signupDiv");
var loginDiv = document.getElementById("loginDiv");

document.getElementById("signupButton").addEventListener("click", signupSelected);
document.getElementById("loginButton").addEventListener("click", loginSelected);
document.getElementById("signupBackToMain").addEventListener("click", backToMain);
document.getElementById("loginBackToMain").addEventListener("click", backToMain);

signupDiv.style.display = "none";
loginDiv.style.display = "none";

function signupSelected(){
  buttonsDiv.style.display = "none";
  signupDiv.style.display = "inline-block";
}

function loginSelected(){
  buttonsDiv.style.display = "none";
  loginDiv.style.display = "inline-block";
}

function backToMain(){
  signupDiv.style.display = "none";
  loginDiv.style.display = "none";
  buttonsDiv.style.display = "inline-block";
}
