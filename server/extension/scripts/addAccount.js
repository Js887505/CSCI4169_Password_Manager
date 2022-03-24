document.getElementById("addAccountButton").addEventListener("click", addAccount);

function addAccount(){
  accounts.addNewAccount(document.getElementById('platformField').value, document.getElementById('usernameField').value, document.getElementById('passwordField').value);
  let accountsObj = JSON.stringify(accounts);
  localStorage.setItem('accounts', accountsObj)
  window.location.href = "../pages/showAccounts.html";
}
