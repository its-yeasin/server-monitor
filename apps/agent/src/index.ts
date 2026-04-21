import axios from 'axios';
import dotenv from 'dotenv';
import * as si from 'systeminformation';
import * as os from 'os';
import { SystemMetrics } from './types';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:4000';
const AGENT_TOKEN = process.env.AGENT_TOKEN;
const SERVER_ID = process.env.SERVER_ID;
const COLLECTION_INTERVAL = parseInt(process.env.COLLECTION_INTERVAL || '10000');

if (!AGENT_TOKEN || !SERVER_ID) {
  console.error('❌ Missing AGENT_TOKEN or SERVER_ID in environment variables');
  process.exit(1);
}

async function collectMetrics(): Promise<SystemMetrics> {
  try {
    const [cpuLoad, mem, fsSize, networkStats] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
    ]);

    const cpuCount = os.cpus().length;
    const loadAvg = os.loadavg();

    // Calculate disk totals
    const diskTotal = fsSize.reduce((acc, fs) => acc + fs.size, 0);
    const diskUsed = fsSize.reduce((acc, fs) => acc + fs.used, 0);
    const diskFree = diskTotal - diskUsed;

    // Network stats (first interface or sum all)
    const netStats = networkStats[0] || {
      rx_bytes: 0,
      tx_bytes: 0,
    };

    const metrics: SystemMetrics = {
      serverId: SERVER_ID!,
      timestamp: new Date(),
      cpu: {
        usage: parseFloat(cpuLoad.currentLoad.toFixed(2)),
        cores: cpuCount,
        loadAvg: loadAvg,
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usagePercent: parseFloat(((mem.used / mem.total) * 100).toFixed(2)),
      },
      disk: {
        total: diskTotal,
        used: diskUsed,
        free: diskFree,
        usagePercent: parseFloat(((diskUsed / diskTotal) * 100).toFixed(2)),
      },
      network: {
        bytesIn: netStats.rx_bytes || 0,
        bytesOut: netStats.tx_bytes || 0,
        packetsIn: 0, // systeminformation doesn't provide packet counts in all versions
        packetsOut: 0,
      },
    };

    return metrics;
  } catch (error) {
    console.error('Error collecting metrics:', error);
    throw error;
  }
}

async function sendMetrics(metrics: SystemMetrics) {
  try {
    await axios.post(`${API_URL}/api/metrics`, metrics, {
      headers: {
        'Authorization': `Bearer ${AGENT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ Metrics sent at ${new Date().toISOString()}`);
  } catch (error: any) {
    console.error('❌ Failed to send metrics:', error.message);
  }
}

async function main() {
  console.log('🤖 Server Monitor Agent starting...');
  console.log(`📡 API URL: ${API_URL}`);
  console.log(`🔑 Server ID: ${SERVER_ID}`);
  console.log(`⏱️  Collection interval: ${COLLECTION_INTERVAL}ms`);

  // Send metrics immediately on start
  try {
    const metrics = await collectMetrics();
    await sendMetrics(metrics);
  } catch (error) {
    console.error('Error on initial metrics collection:', error);
  }

  // Then send at regular intervals
  setInterval(async () => {
    try {
      const metrics = await collectMetrics();
      await sendMetrics(metrics);
    } catch (error) {
      console.error('Error in metrics collection loop:', error);
    }
  }, COLLECTION_INTERVAL);
}

main();
