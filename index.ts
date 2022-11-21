import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import mongoose from 'mongoose';
import switchPointRouter from './controllers/switchPoint';
import {
  requestLogger,
  unKnownEndpoint,
  errorLogger,
  errorResponder,
} from './utils/middleware';
const app: Express = express();
app.use(express.json());

const PORT = process.env.PORT;
const URL = process.env.MONGODB_URI ?? '';

void mongoose
  .connect(URL)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(requestLogger);

app.use('/api', switchPointRouter);

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use(errorLogger);

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use(errorResponder);

app.use(unKnownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
