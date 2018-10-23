let Joi                                  = require('joi');
let validator                            = require('./validator');

exports.userLogin                        = userLogin;
exports.userSignup                       = userSignup;

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