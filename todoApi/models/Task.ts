import mongoose, {Types} from 'mongoose';
import User from './User';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist',
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    default: 'new',
    validate: {
      validator: async (value: string) => {
        return value === 'new' || value === 'is_active' || value === 'complete';
      },
      message: 'Status value must be only "new", "is_active", "complete"',
    },
  }
});
const Task = mongoose.model('Task', TaskSchema);

export default Task;