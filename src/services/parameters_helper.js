
const Joi = require('joi');
const ArgumentError = require('./argument_error');

module.exports = {
    assertIsNumber(param) {
        let result = Joi.validate(param, Joi.number().integer().required());
        if(result.error !== null){
            throw new ArgumentError('Wrong arguments: '+param+' is not an integer');
        }
    },
    assertIsString(param) {
        let result = Joi.validate(param, Joi.string().required());
        if(result.error !== null){
            throw new ArgumentError('Wrong arguments: '+param+' is not a string');
        }
    },
    assertIsDefined(a) {
        if (a === null || a === undefined) {
            throw new ArgumentError('Wrong arguments: '+param + ' is defined');
        }
    }
};