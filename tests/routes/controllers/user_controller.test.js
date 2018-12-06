const request = require('supertest');

const UserHelper = require('../../helpers/user_helper');
const UserService = require('../../services/user_service.test');
const app        = require('../../../src/app');
const ModelsMapper    = require('../../../src/routes/controllers/models_mapper');

function postUser(user) {
    return request(app)
        .post('/api/v1/register')
        .send(user);
}


describe('Test the user registration', () => {

    test('POST /register with valid data should return 200', async () => {
        const response = await postUser({
            name: 'Mario Blu',
            email: 'mario@blu.it',
            badgeNumber: 'AAAAAA',
            password: 'password'
        }).expect(201);

        expect(response.body.token).toBeDefined();
        expect(response.body.userId).toBeDefined();
        await UserHelper.expectUserToExist(response.body.userId);
    });

    test('POST /register without the name should return 400', async () => {
        await postUser({
            email: 'mario@blu.it',
            badgeNumber: 'AAAAAA',
            password: 'password'
        }).expect(400);
    });

    test('POST /register with an already used email should return 409', async () => {
        const existingUser = await UserHelper.insertMario();

        await postUser({
            name: 'Mario Rossi',
            email: existingUser.email,
            badgeNumber: 'AAAAAA',
            password: 'password'
        }).expect(409, {errorMessage: 'email already in use'});
    });

    test('POST /register with an already used badge number should return 409', async () => {
        const existingUser = await UserHelper.insertMario();

        await postUser({
            name: 'Mario Rossi',
            email: 'mario@blu.it',
            badgeNumber: existingUser.badgeNumber,
            password: 'password'
        }).expect(409, {errorMessage: 'badge number already in use'});
    })

});

function postLogin(credentials) {
    return request(app)
        .post('/api/v1/login')
        .send(credentials);
}

describe('Test the user login', () => {
    test('POST /login should return 200 and a new token', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await postLogin({
            email: existingUser.email,
            password: 'password'
        }).expect(200);

        expect(response.body.token).toBeDefined();
        expect(response.body.userId).toBeDefined();
    });

    test('POST /login without the email should return 400', async () => {
        await postLogin({
            password: 'password'
        }).expect(400);
    });

    test('It should not login a user with a wrong password', async () => {
        const existingUser = await UserHelper.insertMario();

        await postLogin({
            email: existingUser.email,
            password: 'wrongPassword'
        }).expect(400);
    });

    test("It should not login a user that doesn't exists", async () => {
        await postLogin({
            email: 'notexisting@user.it',
            password: 'password'
        }).expect(400);
    });
});

describe('test the /users path', () => {

    test('GET /users should return 200', async () => {
        const response = await request(app).get('/api/v1/users');
        expect(response.statusCode).toBe(200);
    });

    test('return of the users without passwords', async () => {
        await UserHelper.insertNewRandom();

        const response = await request(app).get('/api/v1/users');

        response.body.forEach(u => {
            expect(u.id).toBeDefined();
            expect(u.name).toBeDefined();
            expect(u.email).toBeDefined();
            expect(u.badgeNumber).toBeDefined();

            expect(u.password).not.toBeDefined();
            expect(u.authCode).not.toBeDefined();
        });
    });

});


describe('Test user email update', () => {
    test('Should change the email of the given user', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .put('/api/v1/users/me/email')
            .set('X-API-TOKEN', existingUser.authToken)
            .send({
                newEmail: 'luca@bianchi.com'
            });

        expect(response.status).toBe(200);
    })

    test('Should not change the email to an existing one', async () => {
        const existingUser1 = await UserHelper.insertMario();
        const existingUser2 = await UserHelper.insertGiorgio();

        const response = await request(app)
            .put('/api/v1/users/me/email')
            .set('X-API-TOKEN', existingUser1.authToken)
            .send({
                newEmail: existingUser2.email
            });

        expect(response.status).toBe(409);
        expect(response.body.errorMessage).toBe('email already in use');
    });

    test('Should not change the email if the string is not an email address', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .put('/api/v1/users/me/email')
            .set('X-API-TOKEN', existingUser.authToken)
            .send({
                newEmail: 'Not an email!'
            });

        expect(response.status).toBe(400);
    });

    test('Should give an error if email is missing from the request body', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .put('/api/v1/users/me/email')
            .set('X-API-TOKEN', existingUser.authToken)
            .send({});

        expect(response.status).toBe(400);
    });
});

describe('Test get current user data', () => {
    test('GET /users/me should return 200', async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .get('/api/v1/users/me')
            .set('X-API-TOKEN', user.authToken);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(user.id);
        expect(response.body.name).toBe('Mario Rossi');
        expect(response.body.badgeNumber).toBe('000001');
        expect(response.body.email).toBe('mario@rossi.it');
    });
});

describe('Test user data update', () => {
    test('PUT /users/me should return 204', async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .put('/api/v1/users/me')
            .set('X-API-TOKEN', user.authToken)
            .send({
                newName: 'Luca Bianchi',
                newBadgeNumber: '000002'
            });

        expect(response.status).toBe(204);

    });


    test('PUT /users/me without valid token should return 401', async () => {
        const response = await request(app)
            .put('/api/v1/users/me')
            .send({
                newName: 'Luca Bianchi',
                newBadgeNumber: '000002'
            });

        expect(response.status).toBe(401);

    });

    test('PUT /users/me without some fields should return 400', async () => {
        const user = await UserHelper.insertMario();

        const response = await request(app)
            .put('/api/v1/users/me')
            .set('X-API-TOKEN', user.authToken)
            .send({
                newBadgeNumber: '000002'
            });

        expect(response.status).toBe(400);
    });
});

describe('Test get user data given its id',  () => {
    test('GET /users/:id', async () => {
        const newUSer = await UserHelper.insertMario();
        const response = await request(app)
            .get(`/api/v1/users/${newUSer.id}`)
            .set('X-API-TOKEN', newUSer.authToken);

        expect(response.status).toBe(200);

        const user = response.body;
        expect(user).toBeDefined();

        const expectedJson = await ModelsMapper.mapUser(newUSer);
        expect(user).toEqual(expectedJson);
    })
});