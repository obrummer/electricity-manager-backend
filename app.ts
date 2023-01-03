import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import switchPointRouter from './controllers/switchPoint';
import {
  requestLogger,
  unKnownEndpoint,
  errorLogger,
  errorResponder,
} from './utils/middleware';
import { MONGODB_URI } from './utils/config';
import electricityPriceRouter from './controllers/electricityPrice';
import testingRouter from './controllers/testing';
import {
  cronJobToUpdateSwitchPoints,
  updateSwitchPoints,
} from './utils/scheduledFunctions';
const app: Application = express();

app.use(express.json());

app.use(cors());

app.use(express.static('build'));

void mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(requestLogger);

if (process.env.NODE_ENV !== 'test') {
  cronJobToUpdateSwitchPoints.start();
}
void updateSwitchPoints();

app.use('/api', switchPointRouter);

app.use('/api', electricityPriceRouter);
app.get('/favicon.ico', (_req, res) => res.status(204));

if (process.env.NODE_ENV === 'test') {
  app.use('/api', testingRouter);
}

app.use(errorLogger);

app.use(errorResponder);

app.use(unKnownEndpoint);

export default app;
