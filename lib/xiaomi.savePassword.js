var shared = require('./xiaomi.shared.js');
var Promise = require('bluebird');

module.exports = function savePassword(options) {

    return getXiaomiModule()
    .then((id) => {
        return setPasswordParam(options, id)
    })
    .then(() => {
        return saveInMemory(options)
    })
    .then(() => {
        return Promise.resolve()
    })
};

function saveInMemory(options) {
    shared.passwords.clear()
    return Promise.map(options, (gateway) => {
        return Promise.resolve(shared.passwords.set(gateway.sid, gateway.password))
    })
}

function setPasswordParam(options, id){
  var param = {
      name: 'Xiaomi_password',
      value: JSON.stringify(options),
      type: 'hidden',
      module: id,
      description : 'Password\'s list of xiaomi\'s gateway. It is used to control it'
 }
 
 return gladys.param.setValue(param)
      .then(function(){
          return Promise.resolve();
      })
      .catch(e => {
          sails.log.error(`Xiaomi module: Password'\s list not saved. Error ${e}`)
          return Promise.reject()
      })
}

function getXiaomiModule(){
    return gladys.module.get()
        .then(modules => {
            for(let module of modules){
                if(module.slug == 'xiaomi-home'){
                    return Promise.resolve(module.id)
                }
            }
        })
}