module.exports = {
    map(res, error, mappings) {
        const mapping = mappings.find(m => m.error === error.message);

        if (mapping != null) {
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