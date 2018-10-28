let Joi                                  = require('joi');
let validator                            = require('./validator');

exports.userLogin                        = userLogin;
exports.userSignup                       = userSignup;
exports.userLogout                       = userLogout;
exports.accessTokenLogin                 = accessTokenLogin;
exports.getAllMessages                   = getAllMessages;
exports.getAllUsers                      = getAllUsers;


function userLogin(req, res, next){
    let requestSchema    = Joi.object().keys({
        user_name         : Joi.string().options({convert : false}).required(),
        password          : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}

function userSignup(req, res, next){
    let requestSchema    = Joi.object().keys({
        name              : Joi.string().options({convert : false}).required(),
        user_name         : Joi.string().options({convert : false}).required(),
        password          : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}

function accessTokenLogin(req, res, next){
    let requestSchema    = Joi.object().keys({
        access_token      : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}

function userLogout(req, res, next){
    let requestSchema    = Joi.object().keys({
        access_token      : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}

function getAllMessages(req, res, next){
    let requestSchema    = Joi.object().keys({
        access_token      : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}

function getAllUsers(req, res, next){
    let requestSchema    = Joi.object().keys({
        access_token      : Joi.string().options({convert : false}).required(),
    }).unknown(true);

    let validRequest      =  validator.validateFields(req.body, res, requestSchema);
    if(validRequest) {
        next();
    }
}