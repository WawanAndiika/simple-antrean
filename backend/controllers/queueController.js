const queueService = require('../services/queueService');

async function takeQueueNumber(req, res) {
  const { type } = req.body;
  if (!['R', 'W'].includes(type)) {
    return res.status(400).json({ error: 'Invalid queue type' });
  }

  try {
    const queueEntry = await queueService.createQueueEntry(type);
    res.status(201).json(queueEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function callNext(req, res) {
  const { staff_id } = req.body;
  if (!staff_id) {
    return res.status(400).json({ error: 'Staff ID is required' });
  }

  try {
    const result = await queueService.callNextInQueue(staff_id);
    if (!result) {
      return res.status(404).json({ message: 'No customers in queue' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function markAsDone(req, res) {
  const { id } = req.params;
  try {
    const updatedEntry = await queueService.markAsDone(id);
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Queue entry not found' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  takeQueueNumber,
  callNext,
  markAsDone,
};
