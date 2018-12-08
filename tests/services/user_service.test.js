const UserService = require('../../src/services/user_service');
const UserHelper = require('../helpers/user_helper');
const expectToFail = require("../test_utils").expectToFail;

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

        await expect(UserService.registerUser({
            name: 'Mario Blu',
            email: existingUser.email,
            badgeNumber: "AAAAAA",
            password: 'password'
        })).rejects.toThrow(new Error('email already in use'));
    });

    test('Should not register two users with the same badge number', async () => {
        const existingUser = await UserHelper.insertMario();

        await expect(UserService.registerUser({
            name: 'Mario Blu',
            email: 'mario@blu.it',
            badgeNumber: existingUser.badgeNumber,
            password: 'password'
        })).rejects.toThrow(new Error('badge number already in use'));
    });
});

describe('Test the user login', () => {

    test('Should login the user', async () => {
        const existingUser = await UserHelper.insertMario();
        const loggedInUser = await UserService.loginUser(existingUser.email, 'password');

        const fromDb = await UserHelper.findUserInDb(loggedInUser.id);
        expect(loggedInUser.authToken).toBe(fromDb.authToken);
    });

    test('Should throw exception when trying to login with a wrong password', async () => {
        const existingUser = await UserHelper.insertMario();

        await expect(UserService.loginUser(existingUser.email, 'wrongPassword'))
            .rejects.toThrow(new Error('invalid credentials'));
    });

    test('Should throw exception when trying to login a user that doesn\'t exist', async () => {
        await expect(UserService.loginUser('aaa@mail.it', 'password'))
            .rejects.toThrow(new Error('invalid credentials'));
    });
});


describe('Test the listing of existing users', () => {
    test('Should return zero users if no users are registered', async () => {
        const users = await UserService.getAllUsers();

        expect(users.length).toEqual(0);
    });

    test('Should return the registered users', async () => {
        let mario = UserHelper.createUserMario();
        await UserService.registerUser(mario);

        let allUsers = await UserService.getAllUsers();

        let firstUser = allUsers[0];
        expect(firstUser.name)       .toEqual(mario.name);
        expect(firstUser.email)      .toEqual(mario.email);
        expect(firstUser.badgeNumber).toEqual(mario.badgeNumber);
    });

    test('Should return array json of two user', async () => {
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

        const users = await UserService.getAllUsers();
        expect(users.map(u => u.toJSON())).toEqual([
            user1.toJSON(), user2.toJSON()
        ])

    })

});


describe('Test user email update', () => {
    test('Should return the user with the email updated', async () => {
        const user = await UserHelper.insertMario();
        await UserService.updateUserEmail(user.id, 'luca@bianchi.com');

        const updatedUser = await UserHelper.findUserInDb(user.id);
        expect(updatedUser.email).toEqual('luca@bianchi.com');
    });

    test('Should not change the email to an existing one', async () => {
        const existingUser1 = await UserHelper.insertMario();
        const existingUser2 = await UserHelper.insertGiorgio();

        try {
            await UserService.updateUserEmail(existingUser1.id, existingUser2.email);
            expectToFail();
        } catch (e) {
            expect(e.message).toBe(UserService.errors.EMAIL_ALREADY_IN_USE);
        }
    });

    test('Should not change the email if the string is not an email address', async () => {
        const existingUser = await UserHelper.insertMario();

        try {
            await UserService.updateUserEmail(existingUser.id, 'Not an email!');
            expectToFail();
        } catch (e) {
            expect(e.message).toBe(UserService.errors.INVALID_EMAIL);
        }
    });

    test('Should give an error if the user passed is not an user', async () => {
        const existingUser = await UserHelper.insertMario();

        try {
            await UserService.updateUserEmail({field: "Not a user!"}, existingUser.email);
            expectToFail();
        } catch (e) {}
    });
});

describe('Test user data update', () => {
    test('Should return the user with the data updated', async () => {
        const user = await UserHelper.insertMario();

        const updatedUser = await UserService.updateUserData(user.id, {
            name: 'Luca Bianchi',
            badgeNumber: '000002'
        });

        expect(updatedUser.name).toEqual('Luca Bianchi');
        expect(updatedUser.badgeNumber).toEqual('000002');
    })
});

describe('Test get user given its id', () => {
    test('Should return the user given its id', async () => {
        const newUser = await UserHelper.insertMario();
        const user = await UserService.getUserById(newUser.id);

        expect(user.toJSON()).toEqual(newUser.toJSON());
    })
});

describe('Test the update of a password', () => {
   test('Should login properly using the new password', async () => {
       const newUser = await UserHelper.insertMario();
       const newPassword = 'newPassword';
       const userUpdated = await UserService.updateUserPassword(newUser.id, newPassword);

       const loggedInUser = await UserService.loginUser(userUpdated.email, newPassword);

       expect(loggedInUser.authToken).toBeDefined();
   });

   test('Should return error when trying to change the password with a null value', async () => {
       const newUser = await UserHelper.insertMario();

       await expect(UserService.updateUserPassword(newUser.id, null))
           .rejects.toThrow(new Error('"value" must be a string'));
   });

   test('Should return error when trying to change with a short password (less than 6 char)', async () => {
       const newUser = await UserHelper.insertMario();

       await expect(UserService.updateUserPassword(newUser.id, '12345'))
           .rejects.toThrow(new Error('"value" length must be at least 6 characters long'));
   });
});