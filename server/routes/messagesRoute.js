const express = require('express');
const Users = require('../models/userModel');
const auth = require('../middleware/auth')
const router = express.Router();
const Messages = require('../models/messsageModel')

router.post('/addmsg/', auth, async (req, res) => {
    try {
        const from = req.user._id
        const { to, message } = req.body
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })
        res.send("Message added successfully")
    } catch (error) {
        res.status(500).send('Error creating msg: ' + error.message);
    }
})

router.post('/getmsg/', auth, async (req, res) => {
    try {
        const from = req.user._id;
        const { to } = req.body

        const messages = await Messages.find({
            users: {
                $all: [from, to]
            }
        }).sort({ updatedAt: 1 });

        const displayMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        });

        res.send(displayMessages); // Send all messages in one response
    } catch (error) {
        res.status(500).send('Error getting msg: ' + error.message);
    }
});


module.exports = router