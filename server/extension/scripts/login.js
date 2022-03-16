const usersScript = require('../../users.js');

function login(){
  if(usersScript.userExists(document.getElementById("loginUsername").value)){
    let user = usersScript.getUser(document.getElementById("loginUsername").value);
    if(user.checkPassword(document.getElementById("signupPassword").value)){
      alert("Success");
    }
  }
  else{
    // False info
  }
}