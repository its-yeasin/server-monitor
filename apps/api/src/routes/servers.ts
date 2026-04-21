import { Router } from 'express';
import { pool } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const serversRouter = Router();

// List all servers
serversRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        a.last_heartbeat,
        a.version as agent_version,
        a.status as agent_status
      FROM servers s
      LEFT JOIN agents a ON s.id = a.server_id
      ORDER BY s.created_at DESC
    `);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch servers' });
  }
});

// Get single server
serversRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM servers WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching server:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch server' });
  }
});

// Register new server
serversRouter.post('/', async (req, res) => {
  try {
    const { hostname, ipAddress, tags = [] } = req.body;

    const serverResult = await pool.query(
      `INSERT INTO servers (hostname, ip_address, tags, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [hostname, ipAddress, tags, 'offline']
    );

    const server = serverResult.rows[0];

    // Create agent token
    const token = uuidv4();
    await pool.query(
      `INSERT INTO agents (server_id, token, status) 
       VALUES ($1, $2, $3)`,
      [server.id, token, 'inactive']
    );

    res.json({ 
      success: true, 
      data: { 
        server, 
        token,
        installCommand: `curl -sSL https://your-domain.com/install.sh | bash -s -- --token ${token}`
      } 
    });
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ success: false, error: 'Failed to create server' });
  }
});

// Delete server
serversRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM servers WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting server:', error);
    res.status(500).json({ success: false, error: 'Failed to delete server' });
  }
});

export default serversRouter;
