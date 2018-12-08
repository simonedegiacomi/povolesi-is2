const {sequelize} = require('../src/models');

async function dropAndCreateTables() {
    await sequelize.sync({
        force: true
    });
}

beforeEach(async () => {
    await dropAndCreateTables();
});

expect.extend({
    toBeDefinedAndNotNull(received){
        const pass = received !== undefined && received != null;
        if (pass) {
            return {
                message: () => `expected ${received} to be defined or not null`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be undefined or null`,
                pass: false,
            };
        }
    },

    toBeAnInteger(received){
        const pass = !isNaN(parseFloat(received)) && isFinite(received);
        if (pass) {
            return {
                message: () => `expected ${received} to be an integer`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} not to be an integer`,
                pass: false,
            };
        }
    },

    toFail() {
        return {
            message: () => `expected to never reach this point`,
            pass: false,
        };
    }
});
