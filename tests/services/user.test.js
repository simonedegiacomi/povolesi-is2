const UserService = require('../../src/services/user');
const Models      = require('../../src/models/index');

beforeEach((done) => {

    Models.sequelize.sync().then(_ => done())
});

describe('Test the user registration', () => {

    test('It should register the new user', (done) => {
        UserService.registerUser({
            name       : 'Mario Rossi',
            email      : 'mario@rossi.it',
            badgeNumber: "000000",
            password   : 'password'
        }).then(user => {
            expect(user.id).toBeDefined();
            done();
        }).catch(console.log);
    });

});

describe('Test user email update', () => {
    // TODO: 1) Write some tests that call the 'updateUserEmail' method on the UserService
});