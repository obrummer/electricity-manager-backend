import app from '../app';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { SwitchPoint } from '../models/switchPoint';

const api = supertest(app);

const initialSwitchPoints = [
  {
    name: 'HTML is easy',
    isActive: true,
  },
  {
    name: 'HTML is harf',
    isActive: true,
  },
];

beforeEach(async () => {
  await SwitchPoint.deleteMany({});
  const switchPointObject1 = new SwitchPoint(initialSwitchPoints[0]);
  await switchPointObject1.save();
  const switchPointObject2 = new SwitchPoint(initialSwitchPoints[1]);
  await switchPointObject2.save();
});

describe('GET / - a simple api endpoint', () => {
  it('Hello API Request', async () => {
    const response = await api.get('/api/switches');
    expect(response.body).toHaveLength(2);
    console.log(response.body);
    // await api
    //   .get('/api/switches')
    //   .expect(200)
    //   .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  void mongoose.connection.close();
});
