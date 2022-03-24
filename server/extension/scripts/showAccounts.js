const accounts = new Accounts();
if(localStorage.getItem('accounts')){
  let accountsObj = JSON.parse(localStorage.getItem('accounts'));
  accArray = accountsObj.accounts
  for(i in accArray){
    accounts.addNewAccount(accArray[i].platform, accArray[i].username, accArray[i].password);
  }
}


document.getElementById("addNewAccountButton").addEventListener("click", goToAddNewAccount);
var tBody = document.getElementById("tableBody");
set_tBody();

function set_tBody(){
  for(var i=0; i<accounts.size(); i++){
    var newTr = document.createElement("tr");
    newTr.setAttribute('id', 'row' + i);
    createRowContents(newTr, i);
    tBody.appendChild(newTr);
  }
}

function createRowContents(row, accountIndex){
  var account = accounts.getAccount(accountIndex);

  var platformTd = document.createElement("td");
  var platformTdText = document.createTextNode(account.getPlatform());
  platformTd.appendChild(platformTdText);
  platformTd.setAttribute('id', 'platform' + accountIndex);
  row.appendChild(platformTd);
  
  var usernameTd = document.createElement("td");
  var usernameTdText = document.createTextNode(account.getUsername());
  usernameTd.appendChild(usernameTdText);
  usernameTd.setAttribute('id', 'username' + accountIndex);
  row.appendChild(usernameTd);

  var passwordTd = document.createElement("td");
  var passwordTdText = document.createTextNode(account.getPassword());
  passwordTd.appendChild(passwordTdText);
  passwordTd.setAttribute('id', 'password' + accountIndex);
  row.appendChild(passwordTd);

  usernameTd.addEventListener("click", copyToClipboard);
  passwordTd.addEventListener("click", copyToClipboard);
}

function goToAddNewAccount(){
  window.location.href = "../pages/addNewAccount.html";
}

var messageFade;

function copyToClipboard(event) {
  navigator.clipboard.writeText(event.target.innerHTML);
  //document.getElementById("clipboard-message").style.visibility = "visible";
  document.getElementById("clipboard-message").style.opacity = 1;

  if (messageFade) {
    clearTimeout(messageFade);
    messageFade = null;
  }

  setTimeout(function() {
    //document.getElementById("clipboard-message").style.visibility = "hidden";
    document.getElementById("clipboard-message").style.opacity = 0;
  },3000);//Fade the message out after 3 seconds
}