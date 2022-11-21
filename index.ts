import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import switchPointRouter from './controllers/switchPoint';
const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const URL = process.env.MONGODB_URI ?? '';

void mongoose.connect(URL)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use('/api', switchPointRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});