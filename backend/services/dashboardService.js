const db = require('../db');

async function getDashboardData() {
  const waitingCount = await db.query(
    "SELECT COUNT(*) FROM queue_entries WHERE status = 'waiting'"
  );

  const activeStaffCount = await db.query(
    "SELECT COUNT(*) FROM staff WHERE is_active = true"
  );

  const topStaff = await db.query(
    `SELECT s.name, COUNT(q.id) as total_served
     FROM staff s
     JOIN queue_entries q ON s.id = q.staff_id
     WHERE q.status = 'done'
     GROUP BY s.name
     ORDER BY total_served DESC
     LIMIT 3`
  );

  return {
    waiting_count: parseInt(waitingCount.rows[0].count, 10),
    active_staff_count: parseInt(activeStaffCount.rows[0].count, 10),
    top_staff: topStaff.rows,
  };
}

module.exports = { getDashboardData };
