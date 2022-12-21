import express from 'express';
const switchPointRouter = express.Router();
import { SwitchPoint } from '../models/switchPoint';
import { ISwitchPoint } from '../types';
import { validateRequest } from '../utils/validate';
import dayjs from 'dayjs';
import { getElectricityPrice } from '../services/electricityPriceService';

// Get all switches
switchPointRouter.get('/switches', async (_req, res, next) => {
  try {
    const switchPoints = await SwitchPoint.find({});

    // Before returning the switches check if a switch is active, meaning if the current price is higher than the high limit
    const price = await getElectricityPrice();
    const currentDay = dayjs().format('DD.MM.YYYY');
    const currentHour = dayjs().hour().toString().concat(':00');
    const currentPrice = price.find(
      (priceObject: { time: string; date: string }) => {
        return (
          priceObject.time === currentHour && priceObject.date === currentDay
        );
      },
    );

    const switchPointsWithPrice = switchPoints.map((switchPoint) => {
      if (currentPrice) {
        if (switchPoint.highLimit >= currentPrice.price) {
          switchPoint.isActive = true;
        } else {
          switchPoint.isActive = false;
        }
      }
      return switchPoint;
    });

    res.json(switchPointsWithPrice);
  } catch (error) {
    next(error);
  }
});

// Get switch by id
switchPointRouter.get('/switches/:id', async (req, res, next) => {
  try {
    const switchPoint = await SwitchPoint.findById(req.params.id);
    res.json(switchPoint);
  } catch (error) {
    next(error);
  }
});

// Create switch
switchPointRouter.post('/switches', async (req, res, next) => {
  //Todo
  try {
    const { name, isActive, highLimit } = req.body as ISwitchPoint;

    validateRequest(name, isActive, highLimit);

    const switchPoint = new SwitchPoint({
      name,
      isActive,
      highLimit,
    });

    const savedSwitchPoint = await switchPoint.save();
    res.json(savedSwitchPoint);
  } catch (error) {
    next(error);
  }
});

// Update switch
switchPointRouter.put('/switches/:id', async (req, res, next) => {
  try {
    const { name, isActive, highLimit } = req.body as ISwitchPoint;

    validateRequest(name, isActive, highLimit);

    const switchPoint: ISwitchPoint = {
      name,
      isActive,
      highLimit,
    };

    const updatedSwitchPoint = await SwitchPoint.findByIdAndUpdate(
      req.params.id,
      switchPoint,
      { new: true },
    );
    res.json(updatedSwitchPoint);
  } catch (error) {
    next(error);
  }
});

// Delete switch
switchPointRouter.delete('/switches/:id', async (req, res, next) => {
  try {
    await SwitchPoint.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default switchPointRouter;
