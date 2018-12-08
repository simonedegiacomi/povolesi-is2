
const Joi = require('joi');
const ArgumentError = require('./argument_error');

module.exports = {
    assertIsNumber(param, message = null) {
        let result = Joi.validate(param, Joi.number().integer().required());
        if(result.error !== null){
            message = message || 'Wrong arguments: '+param+' is not an integer';
            throw new ArgumentError(message);
        }
    },
    assertIsString(param, message = null) {
        let result = Joi.validate(param, Joi.string().required());
        if(result.error !== null){
            message = message || 'Wrong arguments: '+param+' is not a string';
            throw new ArgumentError(message);
        }
    },
    assertIsEmail(param, message = null) {
        let result = Joi.validate(param, Joi.string().email().required());
        if(result.error !== null){
            message = message || 'Wrong arguments: '+param+' is not a valid email';
            throw new ArgumentError(message);
        }
    },
    assertIsDefined(a, message = null) {
        if (a === null || a === undefined) {
            message = message || 'Wrong arguments: '+param + ' is defined';
            throw new ArgumentError(message);
        }
    }
};