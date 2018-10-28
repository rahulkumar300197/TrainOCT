let Promise = require('bluebird');
let _ = require('underscore');
let lodash = require('lodash');
let md5 = require('md5');
let userServices = require('../services/userServices');
let commonFunctions = require('../../../utilities/commonFunctions');
let path = require('path');


exports.userLogin                  =            userLogin;
exports.userSignup                 =            userSignup;
exports.userLogout                 =            userLogout;
exports.accessTokenLogin           =            accessTokenLogin;
exports.getAllMessages             =            getAllMessages;
exports.getAllUsers                =            getAllUsers;
exports.getIndex                   =            getIndex;
exports.getSignupPage              =            getSignupPage;
exports.getLoginPage               =            getLoginPage;
exports.getErrorPage               =            getErrorPage;

function userLogin(req, res) {
    Promise.coroutine(function* () {
        var userDetailsOptions = { user_name: req.body.user_name };
        var userDetails = yield userServices.getUserDetails(userDetailsOptions);

        if (_.isEmpty(userDetails)) {
            return {
                message : "Invalid Username or Password",
                status  : 100
            };
        }

        if (userDetails[0].password != md5(req.body.password)) {
            return {
                message : "Invalid Username or Password",
                status  : 100
            };
        }

        var accessToken = commonFunctions.generateAccessToken();        
        yield userServices.createUserSession({user_id: userDetails[0].user_id, access_token: accessToken});

        delete userDetails[0].password;
        userDetails[0].access_token = accessToken;

        return {
            message : "Login Success",
            data    : userDetails[0],
            status  : 200
        }; 

    })().then((result) => {
        console.log("LOGIN RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        console.log("LOGIN ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function  userSignup(req,res) {
    Promise.coroutine(function* () {
        let userDetailsOptions = { user_name: req.body.user_name };
        let getUserDetails = yield userServices.getUserDetails(userDetailsOptions);

        if (!_.isEmpty(getUserDetails)) {
            return {
                message : "User Already Exist",
                status  : 100
            };
        }

        let userDetails = {
            name        : req.body.name,
            user_name   : req.body.user_name,
            password    : md5(req.body.password)
        };

        var createUser = yield userServices.createUser(userDetails);

        if(!createUser || !createUser.insertId){
            return {
                message : "Something went wrong",
                status  : 100
            };
        } 
        
        var accessToken = commonFunctions.generateAccessToken();        
        yield userServices.createUserSession({user_id: createUser.insertId, access_token: accessToken});

        delete userDetails.password;
        userDetails.access_token = accessToken;

        return {
            message : "Sucess",
            data    : userDetails,
            status  : 200
        };

    })().then((result) => {
        console.log("SIGNUP RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        console.log("SIGNUP ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function userLogout(req, res) {
    Promise.coroutine(function* () {
        var verifyUserSessionOptions = { access_token: req.body.access_token };
        var userDetails = yield userServices.verifyUserSession(verifyUserSessionOptions);

        if (_.isEmpty(userDetails)) {
            return {
                message : "Invalid Access Token",
                status  : 100
            };
        }

        yield userServices.deactivateUserSession(verifyUserSessionOptions);

        return {
            message : "Logout Success",
            data    : [],
            status  : 200
        }; 

    })().then((result) => {
        console.log("LOGOUT RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        console.log("LOGOUT ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function accessTokenLogin(req, res) {
    Promise.coroutine(function* () {
        var verifyUserSessionOptions = { access_token: req.body.access_token };
        var userDetails = yield userServices.verifyUserSession(verifyUserSessionOptions);

        if (_.isEmpty(userDetails)) {
            return {
                message : "Invalid Access Token",
                status  : 100
            };
        }

        return {
            message : "Login Success",
            data    : userDetails[0],
            status  : 200
        }; 

    })().then((result) => {
        console.log("ACCESS TOKEN LOGIN RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        console.log("ACCESS TOKEN LOGIN ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function getAllMessages(req, res) {
    Promise.coroutine(function* () {
        console.log("===================",req.body.access_token);
        var verifyUserSessionOptions = { access_token: req.body.access_token };
        var userDetails = yield userServices.verifyUserSession(verifyUserSessionOptions);

        if (_.isEmpty(userDetails)) {
            return {
                message : "Invalid Access Token",
                status  : 100
            };
        }

        var allMessagesOptions = { user_id: userDetails[0].user_id };
        var allMessages = yield userServices.getAllMessages(allMessagesOptions);

        if (_.isEmpty(allMessages)) {
            return {
                message : "NO MESSAGES FOUND",
                status  : 100
            };
        }

        return {
            message : "Success",
            data    : allMessages,
            status  : 200
        }; 

    })().then((result) => {
        console.log("GET MESSAGES RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||[], status : result.status});
    }, (error) => {
        console.log("GET MESSAGES ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function getAllUsers(req, res) {
    Promise.coroutine(function* () {

        var verifyUserSessionOptions = { access_token: req.body.access_token };
        var userDetails = yield userServices.verifyUserSession(verifyUserSessionOptions);

        if (_.isEmpty(userDetails)) {
            return {
                message : "Invalid Access Token",
                status  : 100
            };
        }

        var allUserOptions = { user_id: userDetails[0].user_id };
        var allUsers = yield userServices.getAllUsers(allUserOptions);

        if (_.isEmpty(allUsers)) {
            return {
                message : "NO USER FOUND",
                status  : 100
            };
        }

        return {
            message : "Success",
            data    : allUsers,
            status  : 200
        }; 

    })().then((result) => {
        console.log("GET USER RESPONCE =>>>>",JSON.stringify(result));
        return res.send({message: result.message, data: result.data||[], status : result.status});
    }, (error) => {
        console.log("GET USER ERR =>>>>",JSON.stringify(error));
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function getIndex(req,res) {    
    return res.sendFile(path.resolve(__dirname+'/../../../public/index.html'));
}

function getLoginPage(req,res) {    
    return res.sendFile(path.resolve(__dirname+'/../../../public/login.html'));
}

function getSignupPage(req,res) {    
    return res.sendFile(path.resolve(__dirname+'/../../../public/signup.html'));
}

function getErrorPage(req,res) {    
    return res.sendFile(path.resolve(__dirname+'/../../../public/error.html'));
}