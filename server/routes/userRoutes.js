const express = require('express');
const Users = require('../models/userModel');
const auth = require('../middleware/auth')
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  let userEmail = await Users.findOne({ email: req.body.email });
  if (userEmail) return res.status(400).send('User already registered');

  let userName = await Users.findOne({ username: req.body.username });
  if (userName) return res.status(400).send('Username already taken');

  const user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username})
    if (!user) return res.status(400).send('Username or password is incorrect');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Username or password is incorrect');

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send({
      _id: user._id,
      username: user.username,
      email: user.email,
    })
  } catch (error) {
    res.status(500).send('Error finding user: ' + error.message);
  }
})

router.post('/setAvatar/:id', async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(400).send('User not found');

    user.avatarImage = req.body.image;
    user.isAvatarImageSet = true
    await user.save();

    res.send({ success: true });
  } catch (error) {
    res.status(500).send('Error setting avatar: ' + error.message);
  }
})

router.get('/allusers/:id', auth, async (req, res) => {
  try {
    const users = await Users.find({ _id: { $ne: req.user._id } }).select('-password -isAvatarImageSet')

    res.send(users)
  } catch (error) {
    res.status(500).send('Error getting all users: ' + error.message);
  }
})

router.get('/currentuser', auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).select('-password')

    res.send(user)
  } catch (error) {
    res.status(500).send('Error getting all users: ' + error.message);
  }
})

module.exports = router;
