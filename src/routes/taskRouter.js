const express = require('express');


const Task = require('../models/taskModel');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();




// Create a new task
router.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.userId });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: 'Error creating task' });
  }
});

// Get all tasks for the authenticated user
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching tasks' });
  }
});

// Get a single task by ID
router.get('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching task' });
  }
});

// Update a task
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send({ error: 'Error updating task' });
  }
});

// Delete a task
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error deleting task' });
  }
});

module.exports = router;