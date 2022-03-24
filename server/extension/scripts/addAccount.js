document.getElementById("addAccountButton").addEventListener("click", addAccount);
document.getElementById("togglePasswordButton").addEventListener("click", toggleShowPassword);
document.getElementById("sugguestPasswordButton").addEventListener("click", sugguestRandomPassword);

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

const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=!@#$%^&*()_+~;:,.?";
function sugguestRandomPassword() {
  const length = 16;
  let randomPass = "";
  for (let i=0;i < length; i++) {
    index = Math.floor(Math.random() * possibleChars.length);
    randomPass += possibleChars[index];
  }

  document.getElementById('passwordField').value = randomPass;
}