const UserService = require('../../src/services/user');
const Models      = require('../../src/models/index');

beforeEach((done) => {
    Models.sequelize.sync().then(_ => done())
});

test('Should return zero users if no users are registered',  (done) => {
    UserService.getAllUsers().then(users => {
        expect(users).toEqual([]);
        done();
    });

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


