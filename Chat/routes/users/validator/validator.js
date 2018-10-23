/**
 * create by Rahul Kumar on 03/10/2018
 */

let Joi                             = require('joi');

exports.validateFields              = validateFields;

function validateFields(req, res, schema) {
    let validation =Joi.validate(req,schema);
    if(validation.error) {
        let errorReason =
            validation.error.details !== undefined
                ? validation.error.details[0].message
                : 'Parameter missing or parameter type is wrong';
        res.send({message: errorReason, status : 100});
        return false;
    }
    return true;
}