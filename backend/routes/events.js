const express = require('express');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { title, startTime, endTime } = req.body;
  try {
    const event = await Event.create({ title, startTime, endTime, userId: req.user._id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Event not found' });
    }
    event.title = title || event.title;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.status = status || event.status;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.remove();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;