import cron from 'node-cron';
import { SwitchPoint } from '../models/switchPoint';
import {
  getCurrentPrice,
  getElectricityPricesForDate,
  today,
} from './priceHelpers';
import { getElectricityPrice } from '../services/electricityPriceService';

// Cron expression for every hour
const cronExpression = '0 * * * *';

// Function to update switchpoints every hour and check if the current price is higher than the high limit of the switchpoint
// and set the isActive property accordingly
export async function updateSwitchPoints() {
  try {
    const data = await getElectricityPrice();
    const todayData = getElectricityPricesForDate(data, today);
    const currentPrice = getCurrentPrice(todayData);
    const switchPoints = await SwitchPoint.find({});
    console.log('Update function is run with price:', currentPrice);

    switchPoints.forEach(async (switchPoint) => {
      if (switchPoint.highLimit >= currentPrice) {
        switchPoint.isActive = true;
      } else {
        switchPoint.isActive = false;
      }
      await switchPoint.save();
    });
  } catch (error) {
    console.error('Error in updateSwitchPoints function:', error);
  }
}

export const cronJobToUpdateSwitchPoints = cron.schedule(
  cronExpression,
  updateSwitchPoints,
  {
    scheduled: false,
  },
);
