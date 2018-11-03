var Promise         = require('bluebird');

var dbHandler       = require('../../../database/mysqlLib');

exports.getDeviceToken          =          getDeviceToken;
exports.getDeviceTokenCount     =          getDeviceTokenCount;
exports.sendNotification        =          sendNotification;



function getDeviceTokenCount(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_name];
        var query  = "SELECT device_token FROM tb_sessions WHERE is_active = 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function getDeviceToken(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_name];
        var query  = "SELECT device_token FROM tb_sessions WHERE is_active = 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function sendNotification(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_name];
        var query  = "SELECT device_token FROM tb_sessions WHERE is_active = 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}