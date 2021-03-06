const accounts = new Accounts();
var showData = false;
var tBody = document.getElementById("tableBody");
document.getElementById("showHideDataButton").innerHTML = "&#x1F441;";

// Event listeners
document.getElementById("addNewAccountButton").addEventListener("click", goToAddNewAccount);
document.getElementById("lockAccountButton").addEventListener("click", goToIndex);
document.getElementById("showHideDataButton").addEventListener("click", hideShowData);

// Accessing local storage
// For accounts
if(localStorage.getItem('accounts')){
  let accountsObj = JSON.parse(localStorage.getItem('accounts'));
  accArray = accountsObj.accounts
  for(i in accArray){
    accounts.addNewAccount(accArray[i].platform, accArray[i].link, accArray[i].username, accArray[i].password);
  }
}
// For showdata
if(localStorage.getItem('showData')){
  if(localStorage.getItem('showData') === 'true'){
    showData = true;
    document.getElementById("showHideDataButton").innerHTML = "&#128065;";
  }
}

function set_tBody(){
  tBody.innerHTML = "";
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
  platformTd.addEventListener('click', copyToClipboard);
  
  if(showData){
    var usernameTd = document.createElement("td");
    var usernameTdText = document.createTextNode(account.getUsername());
    usernameTd.appendChild(usernameTdText);
    usernameTd.setAttribute('id', 'username' + accountIndex);
    row.appendChild(usernameTd);
  
    var passwordTd = document.createElement("td");
    var passwordTdText = document.createTextNode(CryptoJS.AES.decrypt(account.getPassword(), 'KodSFql5M4e;Q2MX').toString(CryptoJS.enc.Utf8));
    passwordTd.appendChild(passwordTdText);
    passwordTd.setAttribute('id', 'password' + accountIndex);
    row.appendChild(passwordTd);

    usernameTd.addEventListener("click", copyToClipboard);
    passwordTd.addEventListener("click", copyToClipboard);
  }
  else{
    var usernameTd = document.createElement("td");
    var usernameTdText = document.createTextNode('********');
    usernameTd.appendChild(usernameTdText);
    usernameTd.setAttribute('id', 'username' + accountIndex);
    row.appendChild(usernameTd);
  
    var passwordTd = document.createElement("td");
    var passwordTdText = document.createTextNode('********');
    passwordTd.appendChild(passwordTdText);
    passwordTd.setAttribute('id', 'password' + accountIndex);
    row.appendChild(passwordTd);
  }
}

function hideShowData(){
  if(showData){
    showData = false;
    document.getElementById("showHideDataButton").innerHTML = "&#x1F441;";
  }
  else{
    showData = true;
    document.getElementById("showHideDataButton").innerHTML = "&#128065;";
  }
  set_tBody();
  localStorage.setItem('showData', showData)
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

function goToIndex(){
  localStorage.setItem('session', false);
  window.location.href = "../pages/index.html";
}

// Call to setup accounts elements
set_tBody();
