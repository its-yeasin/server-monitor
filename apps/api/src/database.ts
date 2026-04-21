import { Pool } from 'pg';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { createClient } from 'redis';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const influxDB = new InfluxDB({
  url: process.env.INFLUXDB_URL!,
  token: process.env.INFLUXDB_TOKEN!,
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUXDB_ORG!,
  process.env.INFLUXDB_BUCKET!
);

const queryApi = influxDB.getQueryApi(process.env.INFLUXDB_ORG!);

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => console.error('Redis error:', err));

export async function setupDatabase() {
  await redis.connect();
  
  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS servers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      hostname VARCHAR(255) NOT NULL,
      ip_address VARCHAR(45) NOT NULL,
      status VARCHAR(20) DEFAULT 'offline',
      last_seen TIMESTAMP,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      version VARCHAR(50),
      last_heartbeat TIMESTAMP,
      status VARCHAR(20) DEFAULT 'inactive',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS alert_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
      metric VARCHAR(50) NOT NULL,
      condition VARCHAR(10) NOT NULL,
      threshold DECIMAL NOT NULL,
      duration INTEGER DEFAULT 60,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS alerts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
      server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      severity VARCHAR(20) NOT NULL,
      acknowledged BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export { pool, writeApi, queryApi, redis };
