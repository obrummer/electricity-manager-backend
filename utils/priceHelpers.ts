import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { PriceUnit } from '../types';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const today = dayjs().tz('Europe/Helsinki').format('DD.MM.YYYY');
export const tomorrow = dayjs()
  .tz('Europe/Helsinki')
  .add(1, 'day')
  .format('DD.MM.YYYY');
export const yesterday = dayjs()
  .tz('Europe/Helsinki')
  .subtract(1, 'day')
  .format('DD.MM.YYYY');

export const getElectricityPricesForDate = (
  priceUnits: PriceUnit[],
  date: string,
): PriceUnit[] => {
  const prices = priceUnits.filter((priceObject: { date: string }) => {
    return priceObject.date === date;
  });
  return prices;
};

export const getAveragePrice = (priceUnits: PriceUnit[]): number => {
  const averagePrice =
    priceUnits.reduce((acc, item) => acc + item.price, 0) / priceUnits.length;
  return averagePrice;
};

export const getPercentageDifference = (
  currentPrice: number,
  previousPrice: number,
): number => {
  const difference = currentPrice - previousPrice;
  const percentageDifference = (difference / previousPrice) * 100;
  return percentageDifference;
};

export const getHighestPrice = (data: PriceUnit[]): number => {
  const prices = data.map((item) => item.price);
  return Math.max(...prices);
};

export const getLowestPrice = (data: PriceUnit[]): number => {
  const prices = data.map((item) => item.price);
  return Math.min(...prices);
};

export const getCurrentPrice = (data: PriceUnit[]): number => {
  let currentHour = dayjs().tz('Europe/Helsinki').hour().toString();
  if (currentHour.length === 1) {
    currentHour = `0${currentHour}`;
  }
  currentHour = `${currentHour}:00`;
  const currentPrice = data.find((item) => item.time === currentHour);
  if (!currentPrice) {
    return 0;
  }
  return currentPrice.price;
};

export const roundByTwoDecimals = (number: number): number => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};
