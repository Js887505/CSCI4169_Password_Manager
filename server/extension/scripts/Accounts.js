class Accounts {
  constructor() {
    this.accounts = [];
	}

  getAccount(i){
    return this.accounts[i];
  }

  addNewAccount(platform, link, username, password){
    this.accounts.push(new Account(platform, link, username, password));
  }

  size(){
    return this.accounts.length;
  }
}

class Account{
  constructor(platform, link, username, password){
    this.platform = platform;
    this.link = link;
    this.username = username;
    this.password = password;
  }

  getPlatform(){
    return this.platform;
  }

  getURL(){
    return this.link;
  }

  getUsername(){
    return this.username;
  }

  getPassword(){
    return this.password;
  }
}