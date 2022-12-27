import { SwitchPoint } from '../models/switchPoint';
import express from 'express';
const testingRouter = express.Router();

testingRouter.post('/testingReset', async (_req, res, next) => {
  try {
    await SwitchPoint.deleteMany({});
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default testingRouter;
