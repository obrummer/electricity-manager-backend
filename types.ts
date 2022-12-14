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
