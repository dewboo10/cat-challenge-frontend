const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get today's tasks progress
router.get('/today/:userId', async (req, res) => {
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
router.post('/complete', async (req, res) => {
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

module.exports = router; 