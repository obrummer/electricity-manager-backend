import { validateRequest } from './validate';

describe('ValidateRequest', () => {
  it('Throws an error if name is wrong type', () => {
    const name = 50;
    const isActive = true;
    const highLimit = 50;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'Name is missing or wrong type. ',
      );
    }
  });
  it('Throws an error if name is undefined', () => {
    const name = undefined;
    const isActive = true;
    const highLimit = 50;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'Name is missing or wrong type. ',
      );
    }
  });
  it('Throws an error if isActive is wrong type', () => {
    const name = 'Point';
    const isActive = 50;
    const highLimit = 50;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'IsActive is missing or wrong type. ',
      );
    }
  });
  it('Throws an error if isActive is undefined', () => {
    const name = 'Point';
    const isActive = undefined;
    const highLimit = 50;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'IsActive is missing or wrong type. ',
      );
    }
  });
  it('Throws an error if highLimit is wrong type', () => {
    const name = 'Point';
    const isActive = true;
    const highLimit = true;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'HighLimit is missing or wrong type.',
      );
    }
  });
  it('Throws an error if highLimit is undefined', () => {
    const name = 'Point';
    const isActive = true;
    const highLimit = 50;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'HighLimit is missing or wrong type.',
      );
    }
  });
  it('Throws an error if name is null, isActive is wrong type and highLimit is undefined', () => {
    const name = null;
    const isActive = 50;
    const highLimit = undefined;
    try {
      validateRequest(name, isActive, highLimit);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        'message',
        'Name is missing or wrong type. IsActive is missing or wrong type. HighLimit is missing or wrong type.',
      );
    }
  });
});
