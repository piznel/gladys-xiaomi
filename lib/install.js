
module.exports = function install() {
    var param = {
        name: 'Xiaomi_password',
        value: ''
    };

    return gladys.param.getValue(param.name)
    .then((result) => {
        // if it exists, we return it
        return result;
    })
    .catch(() => {
        // if it does not exist, we create it
        sails.log("Xiaomi module : Specify the gateway password(s) in Gladys' Xiaomi_password parameter, separated by a comma");
        return gladys.param.setValue(param);
    });
};
