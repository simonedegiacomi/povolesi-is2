const request = require('supertest');

const {User} = require('../../../src/models');
const app    = require('../../../src/app');

describe('Test the user registration', () => {

    test('It should register the new user', (done) => {
        request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Blu',
                email      : 'mario@blu.it',
                badgeNumber: 'AAAAAA',
                password   : 'password'
            })
            .expect(201)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.userId).toBeDefined();
                done();
            });
    });

    test('Should not register two users with the same email', async () => {
        const existingUser = await User.findOne();

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
        const existingUser = await User.findOne();

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
    test('It should let the user login, responding with a new token', async (done) => {
        const existingUser = await User.findOne();

        request(app)
            .post('/api/v1/login')
            .send({
                email   : existingUser.email,
                password: 'password'
            })
            .expect(200)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.userId).toBeDefined();
                done();
            });
    });

    test('It should not login a user with a wrong password', (done) => {
        const existingUser = User.findOne();

        request(app)
            .post('/api/v1/login')
            .send({
                email   : existingUser.email,
                password: 'wrongPassword'
            })
            .expect(400)
            .then(() => done());
    });

    test("It should not login a user that doesn't exists", (done) => {
        request(app)
            .post('/api/v1/login')
            .send({
                email   : 'notexisting@user.it',
                password: 'password'
            })
            .expect(400)
            .then(() => {
                done();
            });
    });
});

describe('test the /users path', () => {
    urlVer = "/api/v1";

    test('app module should be defined', () => {
        expect(app).toBeDefined();
    });

    test('GET /users should return 200', async () => {
        const response = await request(app).get(urlVer + '/users');
        expect(response.statusCode).toBe(200);
    });

});


describe('Test user email update', () => {
    // TODO: 3) Write some tests that send the PUT to '/users/me/email'
    test('CHANGE', (done) => {
        User.findOne().then(user => {
            return request(app)
                .put('/api/v1/users/me/email')
                .set('X-API-TOKEN', user.authToken)
                .send({
                    newEmail   : 'luca@bianchi.com'
                })
                .expect(200)
                .then(() => done());
        })

    });
});
