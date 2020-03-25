const request = require('supertest');
const nock = require('nock');

const app = require('../app');

// describe('Index router GET request', () => {
//   it('should respond with a 404 for a GET request', async () => {
//     const getRequest = await request(app).get('/');
//     expect(getRequest.statusCode).toBe(404);
//   });
// });

// describe('Index router requests', () => {
//   const postBody = {
//     userid: 'test',
//     email: 'test@gmail.com'};

//   const responseObj = {statusCode: 200, session_token: 'fgdf'};

//   it('should respond with a 200 for POST request', async () => {
//     const response = await request(app)
//         .post('/CBNotification')
//         .send(postBody);

//     expect(response.status).toBe(200);
//     expect(response.body.session_token).toEqual('fgdf');
//   });
// });
