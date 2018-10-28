var Promise         = require('bluebird');

var dbHandler       = require('../../../database/mysqlLib');

exports.getUserDetails          =          getUserDetails;
exports.createUser              =          createUser;
exports.createUserSession       =          createUserSession;
exports.verifyUserSession       =          verifyUserSession;
exports.deactivateUserSession   =          deactivateUserSession;
exports.sendMessage             =          sendMessage;
exports.getAllMessages          =          getAllMessages;
exports.readMessage             =          readMessage;
exports.getAllUsers             =          getAllUsers;



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

function createUserSession(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.access_token,opts.user_id];
        var query  = "INSERT INTO tb_user_sessions (access_token,user_id) VALUES (?,?)";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function verifyUserSession(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.access_token];
        var query  = "SELECT user.* FROM `tb_users` user  LEFT JOIN `tb_user_sessions` user_session " +
        "ON user.`user_id` = user_session.`user_id` WHERE user_session.`access_token` = ? AND user_session.`is_active` = 1 LIMIT 1";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function deactivateUserSession(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.access_token];
        var query  = "UPDATE tb_user_sessions SET `is_active` = 0 WHERE `access_token` = ?";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function sendMessage(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.to_user_id,opts.message,opts.form_user_id];
        var query  = "INSERT INTO tb_user_messages (user_id,message,sender_id) VALUES(?,?,?)";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function getAllMessages(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_id,opts.user_id];
        var query  = "SELECT user_messages.`id`, user_messages.`message`, user_messages.`sender_id`, user.`name`, user_messages.`user_id`, " +
        "user.`user_name` FROM `tb_user_messages` user_messages LEFT JOIN `tb_users` user ON user_messages.`sender_id` " +
        "= user.`user_id` WHERE user_messages.`user_id` = ? OR user_messages.`sender_id` = ? ORDER BY user_messages.`id` ASC";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            console.log("eeeee",error)
            reject(error);
        });
    });
}

function readMessage(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.id];
        var query  = "UPDATE tb_user_messages SET `is_read` = 1 WHERE `id` = ?";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}

function getAllUsers(opts) {
    return new Promise((resolve, reject) => {
        var values = [opts.user_id];
        var query  = "SELECT user.`user_id`, user.`name`, user.`user_name` FROM `tb_users` user " +
        "WHERE user.`user_id`<> ?";
        dbHandler.mysqlQueryPromise(query, values).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}