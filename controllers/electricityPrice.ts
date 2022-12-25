import {
  getElectricityPrice,
  getIndicators,
} from '../services/electricityPriceService';
import express from 'express';
const electricityPriceRouter = express.Router();
import dayjs = require('dayjs');

// Get todays electricity price for current day from ENTSOE
electricityPriceRouter.get('/electricityprice', async (_req, res, next) => {
  try {
    const price = await getElectricityPrice();
    const currentDayPrices = price.filter((priceObject: { date: string }) => {
      return priceObject.date === dayjs().format('DD.MM.YYYY');
    });
    res.json(currentDayPrices);
  } catch (error) {
    next(error);
  }
});

electricityPriceRouter.get(
  '/tomorrowelectricityprice',
  async (_req, res, next) => {
    try {
      const price = await getElectricityPrice();
      const tomorrowPrices = price.filter((priceObject: { date: string }) => {
        return priceObject.date === dayjs().add(1, 'day').format('DD.MM.YYYY');
      });
      res.json(tomorrowPrices);
    } catch (error) {
      next(error);
    }
  },
);

electricityPriceRouter.get(
  '/yesterdayelectricityprice',
  async (_req, res, next) => {
    try {
      const price = await getElectricityPrice();
      const yesterdayPrices = price.filter((priceObject: { date: string }) => {
        return (
          priceObject.date === dayjs().subtract(1, 'day').format('DD.MM.YYYY')
        );
      });
      res.json(yesterdayPrices);
    } catch (error) {
      next(error);
    }
  },
);

electricityPriceRouter.get('/indicators', async (_req, res, next) => {
  try {
    const indicators = await getIndicators();
    res.json(indicators);
  } catch (error) {
    next(error);
  }
});

export default electricityPriceRouter;
