import mongoose, {Types} from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    required: true,
  }
});
const Task = mongoose.model('Task', TaskSchema);

export default Task;