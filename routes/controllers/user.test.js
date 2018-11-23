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
                expect(response.body.name).toBe('Mario Rossi');
                expect(response.body.email).toBe('mario@rossi.it');
                expect(response.body.badgeNumber).toBe('000000');
                done();
            });
    });


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
                done();
            });
    });

});