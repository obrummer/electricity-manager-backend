import {
  getElectricityPriceInXML,
  getParsedElectricityPrice,
  getElectricityPrice,
} from './electricityPriceService';
import axios from 'axios';
import { electricityPriceServiceData } from '../testData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const data = electricityPriceServiceData;

describe('ElectricityPriceService tests', () => {
  it('Function returns data', async () => {
    mockedAxios.get.mockResolvedValue({ data: data });
    await expect(getElectricityPriceInXML()).resolves.toEqual(data);
  });
  it('Get parsed electricity price', async () => {
    mockedAxios.get.mockResolvedValue({ data: data });
    const parsedResponse = await getParsedElectricityPrice();
    expect(parsedResponse).toBeInstanceOf(Object);
  });
  it('Get current day electricity price', async () => {
    mockedAxios.get.mockResolvedValue({ data: data });
    const threeDayData = await getElectricityPrice();
    expect(threeDayData).toHaveLength(72);
  });
});
