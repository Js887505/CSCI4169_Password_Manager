// Accessing local storage
// For accounts
const accounts = new Accounts();
if(localStorage.getItem('accounts')){
  let accountsObj = JSON.parse(localStorage.getItem('accounts'));
  accArray = accountsObj.accounts
  for(i in accArray){
    accounts.addNewAccount(accArray[i].platform, accArray[i].username, accArray[i].password);
  }
}

document.getElementById("addAccountButton").addEventListener("click", addAccount);
document.getElementById("togglePasswordButton").addEventListener("click", toggleShowPassword);
document.getElementById("sugguestPasswordButton").addEventListener("click", sugguestRandomPassword);

function addAccount(){
  var platform = document.getElementById('platformField').value;
  var username = document.getElementById('usernameField').value;
  var password = CryptoJS.AES.encrypt(document.getElementById('passwordField').value, 'KodSFql5M4e;Q2MX').toString();

  accounts.addNewAccount(platform, username, password);

  let accountsObj = JSON.stringify(accounts);
  console.log(accountsObj);
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