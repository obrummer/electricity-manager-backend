// const logger = require('./logger');
//const logger = require('./logger').createLogger();
import { createLogger } from 'logger';
const logger = createLogger();
import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const d = new Date();
  const options = { hour12: false };
  const date = d.toLocaleString('fi-FI', options);

  logger.info(`${req.method}@${req.path} at ${date}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  logger.info('Body if any: ', req.body);
  logger.info('------');
  next();
};

 export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};


const errorHandler = (err: { name: string; message: unknown; }, _req: Request, res: Response, next: NextFunction) => {
    logger.error(err.name);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'Bad format of ID' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: "validation error" });
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    next(err);
};

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('authorization');
//   if (authorization && authorization.toLowerCase().startsWith('bearer')) {
//     req.token = (authorization.substring(7));
//   } else {
//     req.token = null;
//   }
//   next();
// };

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  //tokenExtractor
};