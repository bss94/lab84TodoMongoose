import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import Task from '../models/Task';
import {TaskMutation} from '../types';

const tasksRouter = express.Router();

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User Not Found!'});
    }
    const tasks = await Task.find({user: req.user._id});
    return res.status(200).send(tasks);
  } catch (error) {
    return next(error);
  }
});

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'Unauthorized!'});
    }
    const taskMutation: TaskMutation = {
      user: req.user._id.toString(),
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    const task = new Task(taskMutation);
    await task.save();
    return res.send(task);

  } catch (error) {

    return next(error);
  }
});

export default tasksRouter;