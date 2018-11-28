const UserService = require('../../src/services/user');
const {User}      = require('../../src/models');


test('Should return zero users if no users are registered', async (done) => {
    await User.destroy({where: {}});

    const users = await UserService.getAllUsers();

    expect(users.length).toEqual(0);
    done();
});

describe('Test the user registration', () => {


    test('It should register the new user', (done) => {
        UserService.registerUser({
            name       : 'Mario Blu',
            email      : 'mario@blu.it',
            badgeNumber: "AAAAAA",
            password   : 'password'
        }).then(user => {

            expect(user.id).toBeDefined();
            done();
        }).catch(console.log);
    });


    test('Should return the registered users', (done) => {
        UserService.getAllUsers().then(users => {
            let firstUser = users[0];

            expect(firstUser.name).toEqual('Mario Rossi');
            expect(firstUser.email).toEqual('mario@rossi.it');
            expect(firstUser.badgeNumber).toEqual("000001");

            done();
        });
    });


});


