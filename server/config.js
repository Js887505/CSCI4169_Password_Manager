/*
A class to set default configuration options and to load configuration options from JSON encoded file.

Author(s): Keith Pineo
*/
const fs = require('fs');

class Configuration {
  constructor(defaultConfig,configFileName) {
    console.log("Loading default configuration.");
    this.config = defaultConfig;
    this.loadLocalConfig(configFileName);

    console.log("Configuration loaded.");
  }

  //Loads a Local JSON configuration file. Keys that are the same as defaultConfig will overwrite defaultConfig
  loadLocalConfig(configFileName) {
    console.log(`Loading configuration file from ${configFileName}`);
    let localConfig = {};
    try {
      localConfig = fs.readFileSync(configFileName,{encoding:'utf8', flag:'r'});
      localConfig = JSON.parse(localConfig);
    }
    catch(err) {
      console.log(`There was an error reading the file ${configFileName} in the directory "${__dirname}". Please ensure this file is in valid JSON syntax.`);
      console.log(err);
      console.log();
      localConfig = {};
    }

    //Combine the two objects, localConfig will overwrite defaultConfig where the keys are identical.
    this.config = {...this.config, ...localConfig};
  }
}

/*Please do not commit security credentials to Git. Set them up in your 
.env.local file in the same folder as config.js

Any config settings in .env.local will overwrite the ones here*/
const defaultConfig = {
  "port":80,
};

appConfiguration = new Configuration(defaultConfig,'./.env.local');

module.exports = appConfiguration.config;