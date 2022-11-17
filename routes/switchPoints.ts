import express from 'express';
const switchPointRouter = express.Router();
import switchPointServices from "../services/switchPointService";

switchPointRouter.get('/', (_req, res) => {
  res.send(switchPointServices.getSwitchPoints());
});

switchPointRouter.post('/', (_req, res) => {
  res.send('Saving a switch!');
});

export default switchPointRouter;