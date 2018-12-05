module.exports = {
    assertIsNumber(a, errorToThrow) {
        if (typeof a !== 'number') {
            throw new Error(errorToThrow);
        }
    },
    assertIsString(a, errorToThrow) {
        if (typeof a !== 'string') {
            throw new Error(errorToThrow);
        }
    },
    assertIsDefined(a, errorToThrow) {
        if (!a) {
            throw new Error(errorToThrow);
        }
    }
};