import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import mongoose from 'mongoose';
import switchPointRouter from './controllers/switchPoint';
import {
  requestLogger,
  unKnownEndpoint,
  errorLogger,
  errorResponder,
} from './utils/middleware';
import { MONGODB_URI } from './utils/config';
const app: Application = express();
app.use(express.json());

void mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(requestLogger);

app.use('/api', switchPointRouter);

app.use(errorLogger);

app.use(errorResponder);

app.use(unKnownEndpoint);

export default app;
