import { NextFunction, Request, Response } from 'express';

class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// Logging requests
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const date = new Date();
  console.log(`${req.method}@${req.path} at ${date}`);
  console.log('Body if any: ', req.body);
  console.log('------');
  next();
};

// Error for unknown endpoint
export const unKnownEndpoint = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(`error unknown endpoint`);
  res.status(400);
  res.json({ error: 'Unknown endpoint' });
  next();
};

// Logging the error message
export const errorLogger = (
  error: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log(`error ${error.message}`);
  next(error); // calling next middleware
};

// Function reads the error message and sends back a response
export const errorResponder = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.header('Content-Type', 'application/json');

  const status = error.statusCode || 400;
  res.status(status).send(error.message);
};
