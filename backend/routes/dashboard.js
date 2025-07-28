const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', dashboardController.getDashboardInfo);

module.exports = router;
