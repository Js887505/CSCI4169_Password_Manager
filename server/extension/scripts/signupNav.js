var mainSection = document.getElementById("signupOrLoginSection");
var loginORsignupDiv = document.getElementById("signupOrLoginDiv");
var signupDiv = document.getElementById("signupDiv");
var loginDiv = document.getElementById("loginDiv");
var backToMainButton = document.getElementById("BackToMain");

document.getElementById("noAccountSignupButton").addEventListener("click", signupSelected);
document.getElementById("signupOption").addEventListener("click", signupSelected);
document.getElementById("loginOption").addEventListener("click", loginSelected);
backToMainButton.addEventListener("click", backToMain);

backToMainButton.style.display = "none";
signupDiv.style.display = "none";
loginDiv.style.display = "none";

function signupSelected(){
  loginORsignupDiv.style.display = "none";
  loginDiv.style.display = "none";
  signupDiv.style.display = "inline-block";
  backToMainButton.style.display = "inline-block";
}

function loginSelected(){
  loginORsignupDiv.style.display = "none";
  signupDiv.style.display = "none";
  loginDiv.style.display = "inline-block";
  backToMainButton.style.display = "inline-block";
}

function backToMain(){
  backToMainButton.style.display = "none";
  signupDiv.style.display = "none";
  loginDiv.style.display = "none";
  loginORsignupDiv.style.display = "inline-block";
}