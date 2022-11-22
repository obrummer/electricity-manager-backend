export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isBoolean = (bool: unknown): bool is boolean => {
  return typeof bool === 'boolean' || bool instanceof Boolean;
};

export const isNumber = (numb: unknown): numb is number => {
  return typeof numb === 'number' || numb instanceof Number;
};

export const isEmptyObject = (obj: Record<string, boolean>): boolean => {
  return Object.keys(obj).length === 0;
};

export const validateRequest = (
  name: unknown,
  isActive: unknown,
  highLimit: unknown,
) => {
  let errorMessage = '';
  if (!isString(name)) {
    const stringError = 'Name is missing or wrong type. ';
    errorMessage = errorMessage + stringError;
  }
  if (!isBoolean(isActive)) {
    const booleanError = 'IsActive is missing or wrong type. ';
    errorMessage = errorMessage + booleanError;
  }
  if (!isNumber(highLimit)) {
    const numberError = 'HighLimit is missing or wrong type.';
    errorMessage = errorMessage + numberError;
  }

  if (errorMessage.length > 0) {
    throw new Error(errorMessage);
  }
};
