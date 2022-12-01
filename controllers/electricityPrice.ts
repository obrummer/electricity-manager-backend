import axios from 'axios';
import express from 'express';
const electricityPriceRouter = express.Router();
electricityPriceRouter.get('/electricityprice', async (_req, _res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await axios.get('link');
    console.log(response.data);
    // res.json({
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   data: JSON.parse(JSON.stringify(response.data)),
    // });
    // res.json(response.data);
  } catch (error) {
    next(error);
  }
});

export default electricityPriceRouter;
