const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/msg'); // Adjust the path according to your project structure

const router = express.Router();

// Update a message
router.put('/messages/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const message = await Message.findByIdAndUpdate(id, { text }, { new: true });
        if (!message) {
            return res.status(404).send({ error: 'Message not found' });
        }
        res.send(message);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).send({ error: 'Message not found' });
        }
        res.send({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;