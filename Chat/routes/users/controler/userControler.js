let Promise = require('bluebird');
let _ = require('underscore');
let lodash = require('lodash');
var md5 = require('md5');
let userServices = require('../services/userServices');

exports.userLogin                  =            userLogin;
exports.userSignup                 =            userSignup;

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

        delete userDetails[0].password;

        return {
            message : "Login Success",
            data    : userDetails[0],
            status  : 200
        }; 

    })().then((result) => {
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}

function  userSignup(req,res) {
    Promise.coroutine(function* () {
        console.log("========SIGNUP DATA======",req.body);
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

        delete userDetails.password;

        return {
            message : "Sucess",
            data    : userDetails,
            status  : 200
        };

    })().then((result) => {
        return res.send({message: result.message, data: result.data||{}, status : result.status});
    }, (error) => {
        return res.send({message: lodash.isEmpty(error.message) ? "" : error.message, status : 0});
    });
}