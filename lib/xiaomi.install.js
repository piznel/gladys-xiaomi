const queries = require('./xiaomi.queries.js');

module.exports = function install() {
  var idModule = null;

  return getXiaomiModule()
    .then((id) => {
      idModule = id;
      return createParamPassword(idModule)
    })
    .then(() => {
      return createParamDebug(idModule)
    })
    .catch((err) => {
      sails.log.error('Xiaomi module : install failed with error ', err)
      return 'success'
    })
};

function createParamPassword(id) {
  var param = {
    name: 'Xiaomi_password',
    value: '{}',
    type: 'hidden',
    module: id,
    description: 'Password\'s list of xiaomi\'s gateway. It is used to control it'
  }

  return gladys.param.getValue(param.name)
    .then(() => {
      return gladys.utils.sql(queries.updateIdParamPassword, [param.module])
    })
    .then((data) => {
      return data
    })
    .catch(() => {
      return gladys.param.setValue(param)
    })
}

function createParamDebug(id) {
  var param = {
    name: 'Xiaomi_debug',
    value: '0',
    type: 'hidden',
    module: id,
    description: 'debug level of xiaomi\'s module.'
  }

  return gladys.param.getValue(param.name)
    .then(() => {
      return gladys.utils.sql(queries.updateIdParamDebug, [param.module])
    })
    .then((data) => {
      return data
    })
    .catch(() => {
      return gladys.param.setValue(param)
    })
}

function getXiaomiModule() {
  return gladys.module.get()
    .then(modules => {
      for (let module of modules) {
        if (module.slug == 'xiaomi-home') {
          return Promise.resolve(module.id)
        }
      }
    })
}