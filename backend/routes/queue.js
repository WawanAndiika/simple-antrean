const express = require('express');
const queueController = require('../controllers/queueController');

const router = express.Router();

router.post('/take', queueController.takeQueueNumber);
router.post('/call', queueController.callNext);
router.put('/:id/done', queueController.markAsDone);

module.exports = router;
