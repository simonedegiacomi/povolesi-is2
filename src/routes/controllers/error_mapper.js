const ArgumentError = require('../../services/argument_error')

module.exports = {
    map(res, error, mappings = []) {
        const mapping = mappings.find(m => m.error === error.message);

        if (error instanceof ArgumentError) {
            res.status(400).send({
                errorMessage: error.message
            });
        } else if (mapping != null) {
            res.status(mapping.status).send({
                errorMessage: mapping.error
            });
        } else {
            res.status(500).send({
                errorMessage: 'unknown error'
            });
        }
    }
};