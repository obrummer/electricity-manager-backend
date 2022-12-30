import { Schema, model } from 'mongoose';
import { ISwitchPoint } from '../types';

const switchPointSchema = new Schema<ISwitchPoint>(
  {
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true },
    highLimit: { type: Number, required: true },
  },
  { collection: 'switchpoints', timestamps: true },
);

export const SwitchPoint = model<ISwitchPoint>(
  'SwitchPoint',
  switchPointSchema,
);
