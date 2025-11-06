const express = require('express');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/swappable-slots', protect, async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE' }).populate('userId', 'name email');
    const filteredSlots = slots.filter(slot => slot.userId._id.toString() !== req.user._id.toString());
    res.json(filteredSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/swap-request', protect, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot || mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Invalid slots' });
    }

    if (mySlot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    const swapRequest = await SwapRequest.create({
      requesterId: req.user._id,
      requestedSlotId: theirSlotId,
      offeredSlotId: mySlotId,
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/swap-response/:requestId', protect, async (req, res) => {
  const { accepted } = req.body;
  try {
    const swapRequest = await SwapRequest.findById(req.params.requestId).populate('requestedSlotId offeredSlotId');
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.requestedSlotId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (accepted) {
      const tempUserId = swapRequest.requestedSlotId.userId;
      swapRequest.requestedSlotId.userId = swapRequest.offeredSlotId.userId;
      swapRequest.offeredSlotId.userId = tempUserId;
      swapRequest.requestedSlotId.status = 'BUSY';
      swapRequest.offeredSlotId.status = 'BUSY';

      await swapRequest.requestedSlotId.save();
      await swapRequest.offeredSlotId.save();

      swapRequest.status = 'ACCEPTED';
    } else {
      swapRequest.requestedSlotId.status = 'SWAPPABLE';
      swapRequest.offeredSlotId.status = 'SWAPPABLE';

      await swapRequest.requestedSlotId.save();
      await swapRequest.offeredSlotId.save();

      swapRequest.status = 'REJECTED';
    }

    await swapRequest.save();
    res.json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/incoming', protect, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ status: 'PENDING' })
      .populate('requesterId', 'name email')
      .populate('requestedSlotId')
      .populate('offeredSlotId');
    const incoming = requests.filter(swapReq => swapReq.requestedSlotId && swapReq.requestedSlotId.userId.toString() === req.user._id.toString());
    res.json(incoming);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/outgoing', protect, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ requesterId: req.user._id })
      .populate('requesterId', 'name email')
      .populate('requestedSlotId')
      .populate('offeredSlotId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;