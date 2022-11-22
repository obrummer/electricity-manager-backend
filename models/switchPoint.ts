import { Schema, model } from 'mongoose';

export interface ISwitchPoint {
  name: string;
  isActive: boolean;
  highLimit: number;
}

const switchPointSchema = new Schema<ISwitchPoint>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    highLimit: { type: Number, required: true },
  },
  { collection: 'switchpoints', timestamps: true },
);

export const SwitchPoint = model<ISwitchPoint>(
  'SwitchPoint',
  switchPointSchema,
);
