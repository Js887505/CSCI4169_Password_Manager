class Accounts {
  constructor() {
    this.accounts = [];
	}

  getAccount(i){
    return this.accounts[i];
  }

  addNewAccount(platform, username, password){
    this.accounts.push(new Account(platform, username, password));
  }

  size(){
    return this.accounts.length;
  }


}

class Account{
  constructor(platform, username, password){
    this.platform = platform;
    this.username = username;
    this.password = password;
  }

  getPlatform(){
    return this.platform;
  }

  getUsername(){
    return this.username;
  }

  getPassword(){
    return this.password;
  }
}