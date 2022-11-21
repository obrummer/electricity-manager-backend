import express from 'express';
const switchPointRouter = express.Router();
import { SwitchPoint, ISwitchPoint } from '../models/switchPoint';

// Gets all switches
switchPointRouter.get('/switches', async (_req, res) => {
  const points = await SwitchPoint.find({});
  res.json(points);

  // res.json(points);
  // .then((points) => {
  //   res.json(points);
  // });
});

// Get switch by id
switchPointRouter.get('/switches/:id', (req, res) => {
  void SwitchPoint.findById(req.params.id).then((note) => {
    res.json(note);
  });
});

// Create switch
switchPointRouter.post('/switches', (req, res) => {
  const { name, isActive } = req.body as ISwitchPoint;

  const switchPoint = new SwitchPoint({
    name: name,
    isActive: isActive,
  });

  void switchPoint.save().then((savedNote) => {
    res.json(savedNote);
  });
});

// Update switch
switchPointRouter.put('/switches/:id', (req, res) => {
  const { name, isActive } = req.body as ISwitchPoint;

  const switchPoint: ISwitchPoint = {
    name: name,
    isActive: isActive,
  };

  SwitchPoint.findByIdAndUpdate(req.params.id, switchPoint, { new: true })
    .then((updatedSwitchPoint) => {
      res.json(updatedSwitchPoint);
    })
    .catch((error) => console.error(error));
});

// Delete switch
switchPointRouter.delete('/switches/:id', (req, res, next) => {
  SwitchPoint.findByIdAndRemove(req.params.id)
    .then(function () {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

export default switchPointRouter;
