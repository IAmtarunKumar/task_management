const express = require('express');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

const bcrypt = require("bcrypt")


router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Error creating user' });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    console.log("error" , error.message)
    res.status(400).send({ error: 'Error logging in' });
  }
});


module.exports = router