import app from '../app';
import supertest from 'supertest';

const api = supertest(app);

describe('ElectricityPrice tests', () => {
  it('Electricity response is returned as json', async () => {
    await api
      .get('/api/electricityprice')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});
