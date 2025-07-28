const dashboardService = require('../services/dashboardService');

async function getDashboardInfo(req, res) {
  try {
    const info = await dashboardService.getDashboardData();
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDashboardInfo,
};
