import { getElectricityPriceForCurrentDay } from '../services/electricityPriceService';
import express from 'express';
const electricityPriceRouter = express.Router();

// Get electricity price for current day from ENTSOE
electricityPriceRouter.get('/electricityprice', async (_req, res, next) => {
  try {
    const price = await getElectricityPriceForCurrentDay();
    res.json(price);
  } catch (error) {
    next(error);
  }
});

export default electricityPriceRouter;
