require.config({
  paths: {
    'crypto-js': '../bower_components/crypto-js/crypto-js',
  }
});
const extensionUsers = new extUsers();
document.getElementById("signupButton").addEventListener("click", signup);

function signup(){
  extensionUsers.createUser(document.getElementById("signupUsername").value, document.getElementById("signupPassword").value);
  console.log("User created, Users: ");
  console.log(extensionUsers);
}