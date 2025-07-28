const express = require('express');
const queueRoutes = require('./queue');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

router.use('/queue', queueRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
