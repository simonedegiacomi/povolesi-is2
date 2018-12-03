const request = require('supertest');

const {User}     = require('../../../src/models');
const UserHelper = require('../../helpers/user_helper');
const app        = require('../../../src/app');

describe('Test the user registration', () => {

    test('It should register the new user', async () => {
        const response = await request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Blu',
                email      : 'mario@blu.it',
                badgeNumber: 'AAAAAA',
                password   : 'password'
            });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.userId).toBeDefined();
    });

    test('POST /register without the name should return 400', async () => {
        const response = await request(app)
            .post('/api/v1/register')
            .send({
                email      : 'mario@blu.it',
                badgeNumber: 'AAAAAA',
                password   : 'password'
            });

        expect(response.status).toBe(400);
    });

    test('Should not register two users with the same email', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Rossi',
                email      : existingUser.email,
                badgeNumber: 'AAAAAA',
                password   : 'password'
            });

        expect(response.status).toBe(409);
        expect(response.body.errorMessage).toBe('email already in use');
    });

    test('Should not register two users with the same badge number', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Rossi',
                email      : 'mario@blu.it',
                badgeNumber: existingUser.badgeNumber,
                password   : 'password'
            });

        expect(response.status).toBe(409);
        expect(response.body.errorMessage).toBe('badge number already in use');
    })

});

describe('Test the user login', () => {
    test('It should let the user login, responding with a new token', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email   : existingUser.email,
                password: 'password'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.userId).toBeDefined();
    });

    test('POST /login without the email should return 400', async () => {
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                password: 'password'
            });

        expect(response.status).toBe(400);
    });

    test('It should not login a user with a wrong password', async () => {
        const existingUser = await UserHelper.insertMario();

        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email   : existingUser.email,
                password: 'wrongPassword'
            });

        expect(response.status).toBe(400);
    });

    test("It should not login a user that doesn't exists", async () => {
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email   : 'notexisting@user.it',
                password: 'password'
            });

        expect(response.status).toBe(400);
    });
});

describe('test the /users path', () => {

    test('GET /users should return 200', async () => {
        const response = await request(app).get('/api/v1/users');
        expect(response.statusCode).toBe(200);
    });

    test('return of the users without passwords', async () => {
        UserHelper.insertNewRandom();

        const response = await request(app).get('/api/v1/users');

        response.body.forEach(u => {
            expect(u.id).toBeDefined();
            expect(u.name).toBeDefined();
            expect(u.email).toBeDefined();
            expect(u.badgeNumber).toBeDefined();

            expect(u.password).toBeNull();
            expect(u.authCode).toBeNull();
        });
    });

});


describe('Test user email update', () => {
    // TODO: 3) Write some tests that send the PUT to '/users/me/email'
    test('CHANGE', (done) => {
        UserHelper.insertMario()
            .then(user => {
                return request(app)
                    .put('/api/v1/users/me/email')
                    .set('X-API-TOKEN', user.authToken)
                    .send({
                        newEmail: 'luca@bianchi.com'
                    })
                    .expect(200)
                    .then(() => done());
            })

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
                newName       : 'Luca Bianchi',
                newBadgeNumber: '000002'
            });

        expect(response.status).toBe(204);

    });

    test('PUT /users/me without valid token should return 401', async () => {
        const response = await request(app)
            .put('/api/v1/users/me')
            .send({
                newName       : 'Luca Bianchi',
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