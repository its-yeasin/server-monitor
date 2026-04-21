import { Router } from 'express';
import { pool, writeApi } from '../database';
import { SystemMetrics } from '../types';
import { Point } from '@influxdata/influxdb-client';
import { io } from '../index';

export const metricsRouter = Router();

// Receive metrics from agents
metricsRouter.post('/', async (req, res) => {
  try {
    const metrics: SystemMetrics = req.body;
    const { serverId, cpu, memory, disk, network } = metrics;

    // Update server last_seen
    await pool.query(
      'UPDATE servers SET last_seen = NOW(), status = $1 WHERE id = $2',
      ['online', serverId]
    );

    // Write to InfluxDB
    const point = new Point('system_metrics')
      .tag('server_id', serverId)
      .floatField('cpu_usage', cpu.usage)
      .floatField('cpu_load_avg', cpu.loadAvg[0] || 0)
      .floatField('memory_usage_percent', memory.usagePercent)
      .intField('memory_used', memory.used)
      .intField('memory_total', memory.total)
      .floatField('disk_usage_percent', disk.usagePercent)
      .intField('disk_used', disk.used)
      .intField('disk_total', disk.total)
      .intField('network_bytes_in', network.bytesIn)
      .intField('network_bytes_out', network.bytesOut)
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.flush();

    // Broadcast to WebSocket clients
    io.emit('metrics:update', { serverId, metrics });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to save metrics' });
  }
});

// Get metrics for a server
metricsRouter.get('/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { start, end, interval = '1m' } = req.query;

    const query = `
      from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: ${start || '-1h'}, stop: ${end || 'now()'})
        |> filter(fn: (r) => r.server_id == "${serverId}")
        |> aggregateWindow(every: ${interval}, fn: mean, createEmpty: false)
    `;

    const data: any[] = [];
    const queryApi = require('../database').queryApi;

    await new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next: (row: any, tableMeta: any) => {
          const o = tableMeta.toObject(row);
          data.push(o);
        },
        error: reject,
        complete: resolve,
      });
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error querying metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to query metrics' });
  }
});

export default metricsRouter;
