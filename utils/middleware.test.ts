import { NextFunction, Request, Response } from 'express';
import { unKnownEndpoint } from './middleware';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const nextFunction: NextFunction = jest.fn();

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
  };
});

describe('unKnownEndpoint', () => {
  it('gives right response', () => {
    const expectedResponse = {
      error: 'Unknown endpoint',
    };
    unKnownEndpoint(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(400);
  });
});
