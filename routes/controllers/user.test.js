const request = require('supertest');

const app = require('../../app');

describe('Test the user registration', () => {

    test('It should register the new user', (done) => {
        request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Rossi',
                email      : 'mario@rossi.it',
                badgeNumber: "000000",
                password   : 'password'
            })
            .expect(201)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.userId).toBeDefined();
                done();
            });
    });

    test('Should not register two users with the same email', (done) => {
        request(app)
            .post('/api/v1/register')
            .send({
                name       : 'Mario Rossi 2',
                email      : 'mario2@rossi.it',
                badgeNumber: "000000",
                password   : 'password'
            })
            .expect(201)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.userId).toBeDefined();

                request(app)
                    .post('/api/v1/register')
                    .send({
                        name       : 'Mario Rossi 2',
                        email      : 'mario2@rossi.it',
                        badgeNumber: "000000",
                        password   : 'password'
                    })
                    .expect(409)
                    .then(() => done());
            });
    });


});

describe('Test the user login', () => {
    test('It should let the user login, responding with a new token', (done) => {
        request(app)
            .post('/api/v1/login')
            .send({
                email      : 'mario@rossi.it',
                password   : 'password'
            })
            .expect(200)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.userId).toBeDefined();
                done();
            });
    });

    test('It should not login a user with a wrong password', (done) => {
        request(app)
            .post('/api/v1/login')
            .send({
                email      : 'mario@rossi.it',
                password   : 'wrongPassword'
            })
            .expect(400)
            .then(() => done());
    });

    test("It should not login a user that doesn't exists", (done) => {
        request(app)
            .post('/api/v1/login')
            .send({
                email      : 'luigi@rossi.it',
                password   : 'password'
            })
            .expect(400)
            .then(() => {
                done();
            });
    });
});