import { Router } from 'express';
import { pool } from '../database';

export const alertsRouter = Router();

// List all alerts
alertsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, s.hostname, ar.name as rule_name
      FROM alerts a
      JOIN servers s ON a.server_id = s.id
      JOIN alert_rules ar ON a.rule_id = ar.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alerts' });
  }
});

// List alert rules
alertsRouter.get('/rules', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ar.*, s.hostname
      FROM alert_rules ar
      JOIN servers s ON ar.server_id = s.id
      ORDER BY ar.created_at DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching alert rules:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch alert rules' });
  }
});

// Create alert rule
alertsRouter.post('/rules', async (req, res) => {
  try {
    const { name, serverId, metric, condition, threshold, duration, enabled = true } = req.body;

    const result = await pool.query(
      `INSERT INTO alert_rules (name, server_id, metric, condition, threshold, duration, enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, serverId, metric, condition, threshold, duration, enabled]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating alert rule:', error);
    res.status(500).json({ success: false, error: 'Failed to create alert rule' });
  }
});

// Acknowledge alert
alertsRouter.patch('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE alerts SET acknowledged = true WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ success: false, error: 'Failed to acknowledge alert' });
  }
});

export default alertsRouter;
