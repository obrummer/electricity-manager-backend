export interface ISwitchPoint {
  name: string;
  isActive: boolean;
  highLimit: number;
}

export interface PriceUnit {
  price: number;
  time: string;
  priceWithTax: number;
  date: string;
}

export interface TimeInterval {
  start: string;
  end: string;
}

export interface Period {
  timeInterval: TimeInterval;
}

export interface TimeSeries {
  mRID: string;
  businessType: string;
  inDomainMRID: string;
  outDomainMRID: string;
  currencyUnitName: string;
  priceMeasureUnitName: string;
  curveType: string;
  period: TimeSeriesPeriod;
}

export interface Point {
  position: number;
  priceAmount: number;
}

export interface TimeSeriesPeriod {
  timeInterval: TimeInterval;
  resolution: string;
  point: Point[];
}

export interface PriceDocument {
  timeSeries: TimeSeries[];
  period: Period;
  mRID: string;
  revisionNumber: number;
  type: string;
  senderMarketParticipantMRID: string;
  senderMarketParticipantMarketRoleType: string;
  receiverMarketParticipantMRID: string;
  receiverMarketParticipantMarketRoleType: string;
  createdDateTime: string;
  timezone: string;
}

export enum PriceDate {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  YESTERDAY = 'yesterday',
}

export interface Indicators {
  averagePriceToday: number;
  priceDifferencePercentage: number;
  todayHighestPrice: number;
  todayLowestPrice: number;
  currentPrice: number;
}
