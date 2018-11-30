const UserService = require('../../src/services/user_service');
const {User}      = require('../../src/models');


describe('Test the user registration', () => {


    test('It should register the new user', async () => {

        const newUser = await UserService.registerUser({
            name       : 'Mario Blu',
            email      : 'mario@blu.it',
            badgeNumber: "AAAAAA",
            password   : 'password'
        });

        expect(newUser.id).toBeDefined();
    });

    test('Should not register two users with the same email', async () => {
        const existingUser = await User.findOne();

        try {
            await UserService.registerUser({
                name       : 'Mario Blu',
                email      : existingUser.email,
                badgeNumber: "AAAAAA",
                password   : 'password'
            });

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('email already in use');
        }
    });


});


describe('Test the listing of existing users', () =>{
    test('Should return zero users if no users are registered', async (done) => {
        await User.destroy({where: {}});

        const users = await UserService.getAllUsers();

        expect(users.length).toEqual(0);
        done();
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

    test('Should return array json of two user', async () => {
        const user1 = await UserService.registerUser({
            name       : 'Mario Rossi',
            email      : 'mario2@rossi.it',
            badgeNumber: "000000",
            password   : 'password'
        });

        const user2 = await UserService.registerUser({
            name       : 'Giorgio Segalla',
            email      : 'giorgio@segalla.it',
            badgeNumber: "000021",
            password   : 'passwsard'
        });

        const users = await UserService.getAllUsers()
        //farmi spiegare perchè
        expect(users.map(u => u.toJSON())).toEqual([
            {
                name: user1.name,
                email: user1.email,
                badgeNumber: user1.badgeNumber
            },
            {
                name: user2.name,
                email: user2.email,
                badgeNumber: user2.badgeNumber
            }
        ])

    })

});


describe('Test user email update', () => {
    // TODO: 1) Write some tests that call the 'updateUserEmail' method on the UserService

    test('Should return the user with the email changed',  (done) => {
        User.findOne()
            .then(user => UserService.updateUserEmail(user, 'luca@bianchi.com'))
            .then(user => {
                expect(user.email).toEqual('luca@bianchi.com');
                done();
            }).catch(console.log);
    });
});
