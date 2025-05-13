require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Import routes
const taskRoutes = require('./routes/tasks');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ultimate-prep', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Models
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

const Task = mongoose.model('Task', TaskSchema);

// Routes

// Get today's tasks progress
app.get('/api/tasks/today/:userId', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let tasks = await Task.findOne({
      userId: req.params.userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!tasks) {
      // Create new daily tasks if none exist
      tasks = await Task.create({
        userId: req.params.userId,
        tasks: [
          { type: 'game', name: 'Complete 3 brain games', completed: false },
          { type: 'quiz', name: 'Attempt daily quiz', completed: false },
          { type: 'practice', name: 'Practice one topic', completed: false }
        ],
        totalTasks: 3,
        completedTasks: 0
      });
    }

    const progress = (tasks.completedTasks / tasks.totalTasks) * 100;
    res.json({ tasks, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task completion
app.post('/api/tasks/complete', async (req, res) => {
  try {
    const { userId, taskType, taskName } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!tasks) {
      return res.status(404).json({ error: 'No tasks found for today' });
    }

    const taskIndex = tasks.tasks.findIndex(t => t.type === taskType && t.name === taskName);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.tasks[taskIndex].completed = true;
    tasks.completedTasks += 1;
    await tasks.save();

    const progress = (tasks.completedTasks / tasks.totalTasks) * 100;
    res.json({ tasks, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 