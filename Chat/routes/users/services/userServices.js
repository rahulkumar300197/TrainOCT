var Promise         = require('bluebird');

var dbHandler       = require('../../../database/mysqlLib');

exports.getUserDetails          =          getUserDetails;
exports.createUser              =          createUser;


function getUserDetails(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_name];
        var query  = "SELECT * FROM tb_users WHERE user_name = ? LIMIT 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function createUser(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.name, opts.user_name, opts.password];
        var query  = "INSERT INTO tb_users (name,user_name,password) VALUES (?,?,?)";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}