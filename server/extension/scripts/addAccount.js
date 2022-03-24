document.getElementById("addAccountButton").addEventListener("click", addAccount);
document.getElementById("togglePasswordButton").addEventListener("click", toggleShowPassword);

function addAccount(){
  accounts.addNewAccount(document.getElementById('platformField').value, document.getElementById('usernameField').value, document.getElementById('passwordField').value);
  let accountsObj = JSON.stringify(accounts);
  localStorage.setItem('accounts', accountsObj)
  window.location.href = "../pages/showAccounts.html";
}

function toggleShowPassword() {
  pwField = document.getElementById("passwordField");

  if (pwField.type == "password") {
    pwField.type = "text";
  }
  else {
    pwField.type = "password";
  }
}