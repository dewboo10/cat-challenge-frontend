const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  tasks: [{
    type: { type: String, required: true }, // 'game', 'quiz', 'practice'
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 } // in seconds
  }],
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', TaskSchema); 