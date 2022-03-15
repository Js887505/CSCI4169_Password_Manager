var mainSection = document.getElementById("signupOrLoginSection");
var loginORsignupDiv = document.getElementById("signupOrLoginButtons");
var signupDiv = document.getElementById("signupDiv");
var loginDiv = document.getElementById("loginDiv");

document.getElementById("noAccountSignupButton").addEventListener("click", signupSelected);
document.getElementById("signupOption").addEventListener("click", signupSelected);
document.getElementById("loginOption").addEventListener("click", loginSelected);
document.getElementById("signupBackToMain").addEventListener("click", backToMain);
document.getElementById("loginBackToMain").addEventListener("click", backToMain);

signupDiv.style.display = "none";
loginDiv.style.display = "none";

function signupSelected(){
  loginORsignupDiv.style.display = "none";
  loginDiv.style.display = "none";
  signupDiv.style.display = "inline-block";
}

function loginSelected(){
  loginORsignupDiv.style.display = "none";
  signupDiv.style.display = "none";
  loginDiv.style.display = "inline-block";
}

function backToMain(){
  signupDiv.style.display = "none";
  loginDiv.style.display = "none";
  loginORsignupDiv.style.display = "inline-block";
}
