const UserService = require('../../src/services/user');


test('Should return zero users if no users are registered',  (done) => {
    UserService.getAllUsers().then(users => {
        expect(users).toEqual([]);
        done();
    });
});

describe('Test the user registration', () => {

    let createdUser;

    test('It should register the new user', (done) => {
        UserService.registerUser({
            name       : 'Mario Rossi',
            email      : 'mario@rossi.it',
            badgeNumber: "000000",
            password   : 'password'
        }).then(user => {
            //TODO: da togliere appena troviamo un modo per cancellare il database ad ogni giro di test
            createdUser = user;

            expect(user.id).toBeDefined();
            done();
        }).catch(console.log);
    });


    test('Should return the registered users',  (done) => {
        UserService.getAllUsers().then(users => {
            let firstUser = users[0];
        
            expect(firstUser.name)        .toEqual('Mario Rossi');
            expect(firstUser.email)       .toEqual('mario@rossi.it');
            expect(firstUser.badgeNumber) .toEqual("000000");

            done();
        });
    });


});


