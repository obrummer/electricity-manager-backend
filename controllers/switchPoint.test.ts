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
    //Check response
    expect(points.body).toHaveLength(initialSwitchPoints.length);
    expect(points.body[0].name).toBe(initialSwitchPoints[0].name);
  });

  it('Gets a switch by id', async () => {
    const response = await api.get('/api/switches');
    const singlePoint = await api.get('/api/switches/' + response.body[0]._id);
    //Check response
    expect(singlePoint.body.name).toBe(initialSwitchPoints[0].name);
  });

  it('Creates a switch', async () => {
    const switchPoint = {
      name: 'Third point',
      isActive: true,
      highLimit: 70,
    };

    await api
      .post('/api/switches')
      .send(switchPoint)
      .expect(200)
      .then(async (res) => {
        // Check the response
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toBe(switchPoint.name);
        expect(res.body.isActive).toBe(switchPoint.isActive);

        // Check the data in the database
        const point = await SwitchPoint.findById(res.body._id);
        expect(point).toBeTruthy();
        expect(point?.name).toBe(switchPoint.name);
        expect(point?.highLimit).toBe(switchPoint.highLimit);
      });
  });
  it('Updates a switch', async () => {
    const switchPoint = new SwitchPoint({
      name: 'Point four',
      isActive: true,
      highLimit: 70,
    });

    const updatedData = {
      name: 'Updated point four',
      isActive: false,
      highLimit: 80,
    };

    const savedSwitchPoint = await switchPoint.save();
    console.log(savedSwitchPoint);

    await api
      .put('/api/switches/' + savedSwitchPoint._id)
      .send(updatedData)
      .expect(200)
      .then(async (res) => {
        // Check the response
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toBe(updatedData.name);

        // Check the data in the database
        const point = await SwitchPoint.findById(res.body._id);
        expect(point).toBeTruthy();
        expect(point?.name).toBe(updatedData.name);
        expect(point?.highLimit).toBe(updatedData.highLimit);
      });
  });
  it('Deletes a switch', async () => {
    const switchPoint = new SwitchPoint({
      name: 'Point five',
      isActive: true,
      highLimit: 70,
    });

    const savedSwitchPoint = await switchPoint.save();

    await supertest(app)
      .delete('/api/switches/' + savedSwitchPoint._id)
      .expect(204)
      .then(async () => {
        expect(await SwitchPoint.findById(savedSwitchPoint._id)).toBeFalsy();
      });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
