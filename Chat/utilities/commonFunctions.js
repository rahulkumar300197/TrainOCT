var md5 = require('md5');

exports.generateAccessToken           =       generateAccessToken;


function generateAccessToken() {
    var string = '';

    string += generateRandomStringAndNumbers() + new Date().getTime();
    string = md5(string);
    return string;
}

function generateRandomStringAndNumbers() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}