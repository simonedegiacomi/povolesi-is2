const request = require('supertest');

const app = require('../../../src/app');

let testToken;
let testId;

beforeAll(() => {
    return request(app)
        .post('/api/v1/register')
        .send({
            name       : 'Mario Rossi',
            email      : 'mario@rossi.it',
            badgeNumber: '000000',
            password   : 'password'
        })
        .then(response => {
            testToken = response.body.token;
            testId = response.body.userId;
        })
});

describe('Test current user operations', () => {

    test('Test user operations without a valid token',(done) => {
        request(app)
            .get('/api/v1/user/me')
            .expect(401)
            .then(() => { done(); })
    })

    test('Test get current user data', (done) => {
        request(app)
            .get('/api/v1/user/me')
            .set('X-API-TOKEN', testToken)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(testId);
                expect(response.body.name).toBe('Mario Rossi');
                expect(response.body.badgeNumber).toBe('000000');
                expect(response.body.email).toBe('mario@rossi.it');
                done();
            })
    });

    test('Test update data on current user', (done) => {
        request(app)
            .put('/api/v1/user/me')
            .set('X-API-TOKEN', testToken)
            .send({
                name: 'Mario Bianchi',
                badgeNumber: '111111'
            })
            .expect(204)
            .then(() => { done(); })

    });

    test('Test missing data on user update', (done) => {
        request(app)
            .put('/api/v1/user/me')
            .set('X-API-TOKEN', testToken)
            .send({
                name: 'Mario Bianchi'
            })
            .expect(400)
            .then(() => { done(); })
    })
});