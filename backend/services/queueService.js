const db = require('../db');

async function createQueueEntry(type) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Get the last number for the given type for today
  const lastEntry = await db.query(
    `SELECT queue_number FROM queue_entries 
     WHERE type = $1 AND created_at::date = $2
     ORDER BY id DESC LIMIT 1`,
    [type, today]
  );

  let newNumber = 1;
  if (lastEntry.rows.length > 0) {
    const lastQueueNumber = lastEntry.rows[0].queue_number;
    newNumber = parseInt(lastQueueNumber.substring(1)) + 1;
  }

  const queueNumber = type + String(newNumber).padStart(3, '0');

  const result = await db.query(
    'INSERT INTO queue_entries (queue_number, type) VALUES ($1, $2) RETURNING *',
    [queueNumber, type]
  );
  return result.rows[0];
}

async function callNextInQueue(staffId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const lastTwoCalled = await client.query(
      `SELECT type FROM queue_entries
       WHERE status IN ('called', 'done')
       ORDER BY id DESC
       LIMIT 2`
    );

    const waitingReservations = await client.query(
      `SELECT * FROM queue_entries
       WHERE type = 'R' AND status = 'waiting'
       ORDER BY id ASC`
    );

    const waitingWalkIns = await client.query(
      `SELECT * FROM queue_entries
       WHERE type = 'W' AND status = 'waiting'
       ORDER BY id ASC`
    );

    let nextInQueue = null;

    // Determine the number of recent reservation calls
    const recentReservationCalls = lastTwoCalled.rows.filter(e => e.type === 'R').length;

    if (recentReservationCalls < 2 && waitingReservations.rows.length > 0) {
      nextInQueue = waitingReservations.rows[0];
    } else if (waitingWalkIns.rows.length > 0) {
      nextInQueue = waitingWalkIns.rows[0];
    } else if (waitingReservations.rows.length > 0) {
      nextInQueue = waitingReservations.rows[0];
    } else {
      return null; // No one is waiting
    }

    if (!nextInQueue) {
      return null;
    }

    const updatedEntry = await client.query(
      `UPDATE queue_entries
       SET status = 'called', staff_id = $1
       WHERE id = $2 RETURNING *`,
      [staffId, nextInQueue.id]
    );

    await client.query('COMMIT');

    return updatedEntry.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function markAsDone(id) {
  const result = await db.query(
    `UPDATE queue_entries
     SET status = 'done'
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  createQueueEntry,
  callNextInQueue,
  markAsDone,
};
