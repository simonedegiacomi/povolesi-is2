const {sequelize} = require('../src/models');
const UserService = require('../src/services/user_service');

beforeEach(async (done) => {
    await dropAndCreateTables();
    await importTestData();
    done();
});


async function dropAndCreateTables() {
    await sequelize.sync({
        force: true
    });
}

async function importTestData() {
    await Promise.all([{
        name       : 'Mario Rossi',
        password   : 'password',
        email      : 'mario@rossi.it',
        badgeNumber: '000001'
    }].map((user) => UserService.registerUser(user)));
}

