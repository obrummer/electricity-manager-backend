import express from 'express';
const switchPointRouter = express.Router();
import { SwitchPoint } from '../models/switchPoint';
import { ISwitchPoint } from '../types';
import { validateRequest } from '../utils/validate';
import { getElectricityPrice } from '../services/electricityPriceService';
import { getCurrentPrice } from '../utils/priceHelpers';
import dayjs from 'dayjs';

// Get all switches
switchPointRouter.get('/switches', async (_req, res, next) => {
  try {
    const switchPoints = await SwitchPoint.find({});

    res.json(switchPoints);
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
    const data = await getElectricityPrice();
    const todayData = data.filter((priceObject: { date: string }) => {
      return priceObject.date === dayjs().format('DD.MM.YYYY');
    });
    const currentPrice = getCurrentPrice(todayData);
    const { name, isActive, highLimit } = req.body as ISwitchPoint;

    validateRequest(name, isActive, highLimit);

    const switchPoint = new SwitchPoint({
      name,
      isActive: highLimit >= currentPrice ? true : false,
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
    const data = await getElectricityPrice();
    const todayData = data.filter((priceObject: { date: string }) => {
      return priceObject.date === dayjs().format('DD.MM.YYYY');
    });
    const currentPrice = getCurrentPrice(todayData);
    const { name, isActive, highLimit } = req.body as ISwitchPoint;

    validateRequest(name, isActive, highLimit);

    const switchPoint: ISwitchPoint = {
      name,
      isActive: highLimit >= currentPrice ? true : false,
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
