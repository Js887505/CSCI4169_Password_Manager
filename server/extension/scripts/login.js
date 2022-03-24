document.getElementById("loginButton").addEventListener("click", login);

function login(){
  if(extensionUsers.userExists(document.getElementById("loginUsername").value)){
    user = extensionUsers.getUser(document.getElementById("loginUsername").value);
    console.log(user);
    if(user.checkPassword(document.getElementById("signupPassword").value)){
      alert("Success");
    }
  }
  else{
    // False info
  }
}