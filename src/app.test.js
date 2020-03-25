const request = require('supertest');
const app = require('./app');

describe('Unknown API route', () => {
  it('should respond with a 404 when making a request to an unknown route', async () => {
    const unknownRequest = await request(app).get('/someUnknownRoute');
    expect(unknownRequest.statusCode).toBe(404);
  });

  it('should respond with the correct JSON when an unknown route is requested', async () => {
    const unknownRequest = await request(app).get('/someOtherUnknownRoute');
    expect(unknownRequest.body).toEqual({
      error: 'That endpoint does not exist.'
    });
  });

  it('should respond with a 200 when the endpoint is the base route', async () => {
    const baseRequest = await request(app).get('/CBNotification');
    expect(baseRequest.statusCode).toBe(200);
    expect(baseRequest.body).toEqual({ title: 'CB Notification API Service' });
  });
});
