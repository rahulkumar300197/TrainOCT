var Promise         = require('bluebird');
var dbHandler       = require('../../../database/mysqlLib');
var envProperties   = require('../../../properties/envProperties');
var FCM             = require('fcm-push');             

exports.getDeviceToken          =          getDeviceToken;
exports.getDeviceTokenCount     =          getDeviceTokenCount;
exports.sendNotification        =          sendNotification;



function getDeviceTokenCount(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_name];
        var query  = "SELECT COUNT(*) FROM tb_sessions WHERE is_active = 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function getDeviceToken(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.ofset, opts.limit];
        var query  = "SELECT device_token FROM tb_sessions WHERE is_active = 1 " +
        "LIMIT ?, ?;";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function sendNotification(opts) {
    return new Promise((resolve, reject) => {
        try {
            var fcm = new FCM(envProperties.notificationSettings.fcm_key);
            fcm.send(opts.message, function (err, response) {
                if (err) {
                    console.log("err========",err);
                    reject(err);
                } else {
                    console.log("sucess======",response);
                    resolve(response);
                }
            });
        } catch (e) {
            console.log("exception==========",e);
            reject(e);
        }
    });
}