document.getElementById('loginButton').addEventListener("click", login);

if(localStorage.getItem('session') === 'true'){
  window.location.href = "../pages/showAccounts.html";
}

function login(){
  localStorage.setItem('session', true);
  window.location.href = "../pages/showAccounts.html";
}