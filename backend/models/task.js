const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  name: { type: String, required: true },
  task: { type: String, required: true },
  dueDate: { type: Date },
  progress: {
    type: String,
    enum: ['Backlog', 'Todo', 'Inprogress', 'Completed']
  },
  startDate: { type: Date },
  endDate: { type: Date },
  team: { type: String },
  duration: { type: Number },
  active: { type: Boolean, default: true },
  }, { timestamps: true });
  
  const Task = mongoose.model('Task', taskSchema);
  
  module.exports = Task;