import axios from 'axios';
import { convertableToString, parseStringPromise } from 'xml2js';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  PriceDocument,
  PriceUnit,
  TimeSeries,
  TimeSeriesPeriod,
  Indicators,
} from '../types';
import { ENTSOE_API_KEY } from '../utils/config';
import {
  getAveragePrice,
  getPercentageDifference,
  getHighestPrice,
  getLowestPrice,
  getCurrentPrice,
  roundByTwoDecimals,
} from '../utils/priceHelpers';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// return response from ENTSOE
export const getElectricityPriceInXML = async (
  startDate?: string,
  endDate?: string,
) => {
  const startingDate = startDate
    ? startDate
    : dayjs().subtract(2, 'day').format('YYYYMMDD');
  const endingDate = endDate
    ? endDate
    : dayjs().add(1, 'day').format('YYYYMMDD');
  const documentType = 'A44';
  const inDomain = '10YFI-1--------U';
  const outDomain = '10YFI-1--------U';
  const url = `https://web-api.tp.entsoe.eu/api?securityToken=${ENTSOE_API_KEY}&documentType=${documentType}&in_Domain=${inDomain}&out_Domain=${outDomain}&periodStart=${startingDate}0000&periodEnd=${endingDate}0000`;
  const response = await axios.get(url);

  const data = response.data as convertableToString;

  return data;
};

// parse response from ENTSOE from XML to JSON
export const getParsedElectricityPrice = async (
  startDate?: string,
  endDate?: string,
): Promise<PriceDocument> => {
  const data = await getElectricityPriceInXML(startDate, endDate);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parsedResponse = await parseStringPromise(data);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const r = parsedResponse.Publication_MarketDocument;

  const priceDocument = {
    mRID: r.mRID[0] as string,
    revisionNumber: parseInt(r.revisionNumber[0] as string, 10),
    type: r.type[0] as string,
    senderMarketParticipantMRID: r['sender_MarketParticipant.mRID'][0]
      ._ as string,
    senderMarketParticipantMarketRoleType: r[
      'sender_MarketParticipant.marketRole.type'
    ][0] as string,
    receiverMarketParticipantMRID: r['receiver_MarketParticipant.mRID'][0]
      ._ as string,
    receiverMarketParticipantMarketRoleType: r[
      'receiver_MarketParticipant.marketRole.type'
    ][0] as string,
    createdDateTime: r.createdDateTime[0] as string,
    timezone: 'UTC',
    period: {
      timeInterval: {
        start: r['period.timeInterval'][0].start[0] as string,
        end: r['period.timeInterval'][0].end[0] as string,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    timeSeries: r.TimeSeries.map(
      (ts: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [x: string]: any[];
        mRID: string[];
        businessType: string[];
        curveType: string[];
        Period: {
          resolution: string;
          timeInterval: any;
          Point: any[];
        }[];
      }) => ({
        mRID: ts.mRID[0],
        businessType: ts.businessType[0],
        inDomainMRID: ts['in_Domain.mRID'][0]._ as string,
        outDomainMRID: ts['out_Domain.mRID'][0]._ as string,
        currencyUnitName: ts['currency_Unit.name'][0] as string,
        priceMeasureUnitName: ts['price_Measure_Unit.name'][0] as string,
        curveType: ts.curveType[0],
        period: {
          timeInterval: {
            start: ts.Period[0].timeInterval[0].start[0] as string,
            end: ts.Period[0].timeInterval[0].end[0] as string,
          },
          resolution: ts.Period[0].resolution[0],
          point: ts.Period[0].Point.map((po) => ({
            position: parseInt(po.position[0] as string, 10),
            priceAmount: parseFloat(po['price.amount'][0] as string),
          })),
        } as TimeSeriesPeriod,
      }),
    ) as TimeSeries[],
  };
  return priceDocument;
};

// format response from getElectricityPrice
export const getElectricityPrice = async (
  startDate?: string,
  endDate?: string,
): Promise<PriceUnit[]> => {
  const priceDocument = await getParsedElectricityPrice(startDate, endDate);

  const priceUnits = priceDocument.timeSeries
    .map((timeSeries: TimeSeries) => {
      const points = timeSeries.period.point.map((point) => ({
        price:
          Math.round((point.priceAmount / 10 + Number.EPSILON) * 100) / 100,
        time:
          point.position.toString().length === 1
            ? `0${point.position}:00`
            : `${point.position.toString()}:00`,
        date: timeSeries.period.timeInterval.start,
        priceWithTax:
          Math.round(((point.priceAmount / 10) * 1.1 + Number.EPSILON) * 100) /
          100,
      }));
      return points;
    })
    .flat(1) as PriceUnit[];

  priceUnits.forEach((item) => {
    if (item.time === '24:00') {
      item.time = '00:00';
      const date = new Date(item.date);
      date.setDate(date.getDate() + 1);
      item.date = date.toISOString();
    }
  });

  priceUnits.forEach((item) => {
    item.date = dayjs(item.date).tz('Europe/Helsinki').format('DD.MM.YYYY');
  });
  return priceUnits;
};

export const getIndicators = async (): Promise<Indicators> => {
  const data = await getElectricityPrice();
  const todayData = data.filter((priceObject: { date: string }) => {
    return priceObject.date === dayjs().format('DD.MM.YYYY');
  });
  const averagePriceToday = getAveragePrice(todayData);
  const yesterdayData = data.filter((priceObject: { date: string }) => {
    return priceObject.date === dayjs().subtract(1, 'day').format('DD.MM.YYYY');
  });
  const averagePriceYesterday = getAveragePrice(yesterdayData);

  const priceDifferencePercentage = roundByTwoDecimals(
    getPercentageDifference(averagePriceToday, averagePriceYesterday),
  );

  const todayHighestPrice = roundByTwoDecimals(getHighestPrice(todayData));
  const todayLowestPrice = roundByTwoDecimals(getLowestPrice(todayData));

  const currentPrice = roundByTwoDecimals(getCurrentPrice(todayData));

  const indicators = {
    averagePriceToday: roundByTwoDecimals(averagePriceToday),
    priceDifferencePercentage: priceDifferencePercentage,
    todayHighestPrice: todayHighestPrice,
    todayLowestPrice: todayLowestPrice,
    currentPrice: currentPrice,
  };

  return indicators;
};
