const UserService = require('./user');
const Models      = require('../models');

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