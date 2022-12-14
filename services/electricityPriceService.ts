/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';
import { convertableToString, parseStringPromise } from 'xml2js';
import dayjs from 'dayjs';
import { PriceUnit } from '../types';
import { ENTSOE_API_KEY } from '../utils/config';

// return response from ENTSOE parsed to JSON format
export const getElectricityPrice = async () =>
  // startDate?: string,
  // endDate?: string,
  {
    const previousDate = dayjs().subtract(1, 'day').format('YYYYMMDD');
    const tomorrowDate = dayjs().add(1, 'day').format('YYYYMMDD');

    const response = await axios.get(
      `https://web-api.tp.entsoe.eu/api?securityToken=${ENTSOE_API_KEY}&documentType=A44&in_Domain=10YFI-1--------U&out_Domain=10YFI-1--------U&periodStart=${previousDate}2200&periodEnd=${tomorrowDate}2200`,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedResponse = await parseStringPromise(
      response.data as convertableToString,
    );
    const r = parsedResponse.Publication_MarketDocument;

    const priceDocument = {
      mRID: r.mRID[0],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      revisionNumber: parseInt(r.revisionNumber[0], 10),
      type: r.type[0],
      senderMarketParticipantMRID: r['sender_MarketParticipant.mRID'][0]._,
      senderMarketParticipantMarketRoleType:
        r['sender_MarketParticipant.marketRole.type'][0],
      receiverMarketParticipantMRID: r['receiver_MarketParticipant.mRID'][0]._,
      receiverMarketParticipantMarketRoleType:
        r['receiver_MarketParticipant.marketRole.type'][0],
      createdDateTime: r.createdDateTime[0],
      timezone: 'UTC',
      period: {
        timeInterval: {
          start: r['period.timeInterval'][0].start[0],
          end: r['period.timeInterval'][0].end[0],
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      timeSeries: r.TimeSeries.map(
        (ts: {
          [x: string]: any[];
          mRID: any[];
          businessType: any[];
          curveType: any[];
          Period: {
            resolution: any;
            timeInterval: any;
            Point: any[];
          }[];
        }) => ({
          mRID: ts.mRID[0],
          businessType: ts.businessType[0],
          inDomainMRID: ts['in_Domain.mRID'][0]._,
          outDomainMRID: ts['out_Domain.mRID'][0]._,
          currencyUnitName: ts['currency_Unit.name'][0],
          priceMeasureUnitName: ts['price_Measure_Unit.name'][0],
          curveType: ts.curveType[0],
          period: {
            timeInterval: {
              start: ts.Period[0].timeInterval[0].start[0],
              end: ts.Period[0].timeInterval[0].end[0],
            },
            resolution: ts.Period[0].resolution[0],
            point: ts.Period[0].Point.map((po) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              position: parseInt(po.position[0], 10),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              priceAmount: parseFloat(po['price.amount'][0]),
            })),
          },
        }),
      ),
    };
    return priceDocument;
  };

const formatHour = (hourString: string) =>
  (hourString.length === 1 ? '0' : '') + hourString;

// format response from getElectricityPrice
export const getElectricityPriceForCurrentDay = async (): Promise<
  PriceUnit[]
> => {
  const priceDocument = await getElectricityPrice();
  const priceForFrontend = {
    priceArray: priceDocument.timeSeries[1].period.point.map(
      (point: { priceAmount: number }) => point.priceAmount,
    ),
    previousDayPrice: priceDocument.timeSeries[0].period.point.map(
      (point: { priceAmount: number }) => point.priceAmount,
    ),

    timeArray: priceDocument.timeSeries[0].period.point.map(
      (point: { position: any }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const date = new Date(priceDocument.period.timeInterval.start);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        date.setHours(date.getHours() - 2 + point.position);
        return `${formatHour(date.getHours().toString())}:${formatHour(
          date.getMinutes().toString(),
        )}`;
      },
    ),
  };

  const lastItem = priceForFrontend.previousDayPrice[23];
  const newArray = [lastItem].concat(priceForFrontend.priceArray);
  newArray.pop();

  priceForFrontend.priceArray = newArray.map(
    (price: number, index: number) => ({
      price: Math.round((price / 10 + Number.EPSILON) * 100) / 100,
      time: priceForFrontend.timeArray[index],
      priceWithTax:
        Math.round(((price / 10) * 1.1 + Number.EPSILON) * 100) / 100,
      date: dayjs(priceDocument.period.timeInterval.end as string)
        .subtract(1, 'day')
        .format('DD.MM.YYYY'),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return priceForFrontend.priceArray;
};
