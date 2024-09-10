import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    user.generateToken();
    await user.save();
    return res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});
usersRouter.post('/session', async (req, res, next) => {
  try {
    if(!req.body.username || !req.body.password) {
      return res.status(400).send({error: 'username and password are required!'});
    }
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      return res.status(400).send({error: 'User not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send({error: 'Password is wrong!'});
    }
    user.generateToken();
    await user.save();
    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

export default usersRouter;