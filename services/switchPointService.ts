import switchPointData from "../data/switchPoints.json";
import { SwitchPoint } from "../types";

const switchPoints: Array<SwitchPoint> = switchPointData;

const getSwitchPoints = (): Array<SwitchPoint> => {
  return switchPoints;
};

const addSwitchPoint = () => {
  return null;
};

export default {
  getSwitchPoints,
  addSwitchPoint
};