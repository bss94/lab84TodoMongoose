import express from 'express';
import auth, {RequestWithUser} from '../middleware/auth';
import Task from '../models/Task';
import {TaskMutation} from '../types';
import mongoose from 'mongoose';

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
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'Unauthorized!'});
    }
    const taskToDelete = await Task.findById(req.params.id);
    if (!taskToDelete) {
      return res.status(404).send({error: 'Task not found! Id is wrong!'});
    }
    if (req.user._id.toString() !== taskToDelete.user.toString()) {
      return res.status(403).send({error: `You have not right to delete this task!`});
    }
    await Task.deleteOne({_id: req.params.id});
    return res.send({message: 'Task deleted successfully!'});
  } catch (error) {
    return next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'Unauthorized!'});
    }
    const taskToUpdate = await Task.findById(req.params.id);
    if (!taskToUpdate) {
      return res.status(404).send({error: 'Task not found! Id is wrong!'});
    }
    if (req.user._id.toString() !== taskToUpdate.user.toString()) {
      return res.status(403).send({error: `You have not right to update this task!`});
    }
    if (req.body.status && req.body.status !== 'in_progress' && req.body.status !== 'complete') {
      return res.status(400).send({error: 'Status is wrong!'});
    }
    const taskUpdated = {
      title: req.body.title ? req.body.title : taskToUpdate.title,
      description: req.body.description ? req.body.description : taskToUpdate.description,
      status: req.body.status ? req.body.status : taskToUpdate.status,
    };
    await Task.findByIdAndUpdate(req.params.id, taskUpdated);
    const updated = await Task.findById(req.params.id);
    return res.send(updated);
  } catch (error) {
    return next(error);
  }
});

export default tasksRouter;