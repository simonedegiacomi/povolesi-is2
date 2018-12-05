const UserService = require('../../src/services/user_service');
const {User} = require('../../src/models');
const UserHelper = require('../helpers/user_helper');

describe('Test the user registration', () => {


    test('It should register the new user', async () => {

        const newUser = await UserService.registerUser({
            name: 'Mario Blu',
            email: 'mario@blu.it',
            badgeNumber: "AAAAAA",
            password: 'password'
        });

        expect(newUser.id).toBeDefined();
    });

    test('Should not register two users with the same email', async () => {
        const existingUser = await UserHelper.insertMario();

        try {
            await UserService.registerUser({
                name: 'Mario Blu',
                email: existingUser.email,
                badgeNumber: "AAAAAA",
                password: 'password'
            });

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('email already in use');
        }
    });


});


describe('Test the listing of existing users', () => {
    test('Should return zero users if no users are registered', async (done) => {
        //elimina dal database gli utenti
        await User.destroy({where: {}});

        const users = await UserService.getAllUsers();

        expect(users.length).toEqual(0);
        done();
    });

    test('Should return the registered users', async (done) => {
        await UserHelper.insertMario();
        UserService.getAllUsers().then(users => {
            let firstUser = users[0];

            expect(firstUser.name).toEqual('Mario Rossi');
            expect(firstUser.email).toEqual('mario@rossi.it');
            expect(firstUser.badgeNumber).toEqual("000001");

            done();
        });
    });

    test('Should return array json of two user', async () => {
        //elimina gli utenti dal database
        await User.destroy({where: {}});

        const user1 = await UserService.registerUser({
            name: 'Mario Rossi',
            email: 'mario2@rossi.it',
            badgeNumber: "000000",
            password: 'password'
        });

        const user2 = await UserService.registerUser({
            name: 'Giorgio Segalla',
            email: 'giorgio@segalla.it',
            badgeNumber: "000021",
            password: 'passwsard'
        });

        const users = await UserService.getAllUsers()
        expect(users.map(u => u.toJSON())).toEqual([
            user1.toJSON(), user2.toJSON()
        ])

    })

});


describe('Test user email update', () => {
    test('Should return the user with the email updated', async () => {
        const existingUser = await UserHelper.insertMario()
        const existingUserWithNewEmail = await UserService.updateUserEmail(existingUser, 'luca@bianchi.com');

        expect(existingUserWithNewEmail.email).toEqual('luca@bianchi.com');
    });

    test('Should not change the email to an existing one', async () => {
        const existingUser1 = await UserHelper.insertMario();
        const existingUser2 = await UserHelper.insertGiorgio();

        try {
            await UserService.updateUserEmail(existingUser1, existingUser2.email);

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('email already in use');
        }
    });

    test('Should not change the email if the string is not an email address', async () => {
        const existingUser = await UserHelper.insertMario();

        try {
            await UserService.updateUserEmail(existingUser, 'Not an email!');

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('\"value\" must be a valid email');
        }
    });

    test('Should give an error if the user passed is not an user', async () => {
        const existingUser = await UserHelper.insertMario();

        try {
            await UserService.updateUserEmail({field: "Not a user!"}, existingUser.email);

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('invalid user');
        }
    });
});

describe('Test user data update', () => {
    test('Should return the user with the data updated', (done) => {
        UserHelper.insertMario()
            .then(user => UserService.updateUserData(user, 'Luca Bianchi', '000002'))
            .then(user => {
                expect(user.name).toEqual('Luca Bianchi');
                expect(user.badgeNumber).toEqual('000002');
                done();
            }).catch(console.log);
    });
});
