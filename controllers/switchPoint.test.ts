import app from '../app';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { SwitchPoint } from '../models/switchPoint';

const api = supertest(app);

const initialSwitchPoints = [
  {
    name: 'First point',
    isActive: true,
    highLimit: 50,
  },
  {
    name: 'Second point',
    isActive: true,
    highLimit: 60,
  },
];

beforeEach(async () => {
  await SwitchPoint.deleteMany({});
  console.log('cleared');
  const switchPointObject1 = new SwitchPoint(initialSwitchPoints[0]);
  await switchPointObject1.save();
  const switchPointObject2 = new SwitchPoint(initialSwitchPoints[1]);
  await switchPointObject2.save();
  console.log('done');
});

describe('Switch CRUD tests', () => {
  it('Switches are returned as json', async () => {
    await api
      .get('/api/switches')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  it('Gets all switches', async () => {
    const points = await api.get('/api/switches');
    expect(points.body).toHaveLength(initialSwitchPoints.length);
    expect(points.body[0].name).toBe(initialSwitchPoints[0].name);
  });
  it('Gets an item by id', async () => {
    const response = await api.get('/api/switches');
    const singlePoint = await api.get('/api/switches/' + response.body[0]._id);
    expect(singlePoint.body.name).toBe(initialSwitchPoints[0].name);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
