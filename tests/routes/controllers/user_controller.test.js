const request = require('supertest');

const {User}     = require('../../../src/models');
const UserHelper = require('../../helpers/user_helper');
const app        = require('../../../src/app');

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
    test('It should let the user login, responding with a new token', async (done) => {
        const existingUser = await UserHelper.insertMario();

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

    test('POST /login without the email should return 400', async () => {
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                password: 'password'
            });

        expect(response.status).toBe(400);
    });

    test('It should not login a user with a wrong password', (done) => {
        UserHelper.insertMario().then(existingUser => {
            request(app)
                .post('/api/v1/login')
                .send({
                    email   : existingUser.email,
                    password: 'wrongPassword'
                })
                .expect(400)
                .then(() => done());
        });
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

    test('return of the users without passwords', async () => {

        result = await request(app).get(urlVer + '/users')

        // i campi che devono essere inviati in output
        fieldNeed = ["name", "email", "badgeNumber"]

        JSON.parse(result.text).map(u => {
                i = 0
                for (var k in u) {
                    expect(fieldNeed).toContain(k)
                    i++
                }
                expect(i).toEqual(fieldNeed.length)
            }
        )


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
    test('GET /users/me should return 200', (done) => {
        UserHelper.insertMario()
            .then(user => {
                return request(app)
                    .get('/api/v1/users/me')
                    .set('X-API-TOKEN', user.authToken)
                    .expect(200)
                    .then(response => {
                        expect(response.body.id).toBe(user.id);
                        expect(response.body.name).toBe('Mario Rossi');
                        expect(response.body.badgeNumber).toBe('000001');
                        expect(response.body.email).toBe('mario@rossi.it');
                        done();
                    })
            })
    });
});

describe('Test user data update', () => {
    test('PUT /users/me should return 204', (done) => {
        UserHelper.insertMario()
            .then(user => {
                return request(app)
                    .put('/api/v1/users/me')
                    .set('X-API-TOKEN', user.authToken)
                    .send({
                        newName       : 'Luca Bianchi',
                        newBadgeNumber: '000002'
                    })
                    .expect(204)
                    .then(() => done());
            })
    });

    test('PUT /users/me without valid token should return 401', (done) => {
        UserHelper.insertMario()
            .then(user => {
                return request(app)
                    .put('/api/v1/users/me')
                    .send({
                        newName       : 'Luca Bianchi',
                        newBadgeNumber: '000002'
                    })
                    .expect(401)
                    .then(() => done());
            })
    });

    test('PUT /users/me without some fields should return 400', (done) => {
        UserHelper.insertMario()
            .then(user => {
                return request(app)
                    .put('/api/v1/users/me')
                    .set('X-API-TOKEN', user.authToken)
                    .send({
                        newBadgeNumber: '000002'
                    })
                    .expect(400)
                    .then(() => done());
            })
    });
});