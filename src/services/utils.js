const Joi = require('joi');

const ArgumentError = require('./argument_error');

module.exports = {
    validateSchemaOrThrowArgumentError(data, schema) {
        const {error} = Joi.validate(data, schema);

        if (error != null) {
            throw new ArgumentError(error.details[0].message);
        }
    }
};