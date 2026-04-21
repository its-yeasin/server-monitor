# 🚀 Deploy Server Monitor NOW

## Quick Deploy (One Command)

Run this command with sudo access:

```bash
cd /home/node/.openclaw/workspace/server-monitor
sudo bash deploy-easypanel.sh
```

This will:
1. ✅ Pull latest code
2. ✅ Build all Docker containers
3. ✅ Start all 5 services (Postgres, InfluxDB, Redis, API, Web)
4. ✅ Show status and next steps

---

## If Script Doesn't Work (Manual Steps)

### Step 1: Start Services
```bash
cd /home/node/.openclaw/workspace/server-monitor
sudo docker compose -f docker-compose.production.yml up -d --build
```

### Step 2: Check Status
```bash
sudo docker compose -f docker-compose.production.yml ps
```

You should see 5 containers running:
- server-monitor-postgres
- server-monitor-influxdb
- server-monitor-redis
- server-monitor-api
- server-monitor-web

### Step 3: Test Locally
```bash
curl http://localhost:4000/health
curl http://localhost:3000
```

---

## Configure Domains in Easypanel

1. **Open your Easypanel dashboard** (usually at port 3000 or 3001)

2. **Add Proxy Rules:**
   - **Dashboard**: 
     - Domain: `monitor.itsyeasin.com`
     - Target: `localhost:3000`
     - Enable SSL: ✅
   
   - **API**:
     - Domain: `monitor-api.itsyeasin.com`
     - Target: `localhost:4000`
     - Enable SSL: ✅

3. **DNS Records** (in your domain registrar):
   ```
   A    monitor           YOUR_SERVER_IP
   A    monitor-api       YOUR_SERVER_IP
   ```

---

## Access Your Dashboard

Once domains are configured:
- 🌐 Dashboard: https://monitor.itsyeasin.com
- 🔌 API: https://monitor-api.itsyeasin.com/health

---

## Troubleshooting

### View Logs
```bash
cd /home/node/.openclaw/workspace/server-monitor
sudo docker compose -f docker-compose.production.yml logs -f
```

### View Specific Service
```bash
sudo docker logs server-monitor-api -f
sudo docker logs server-monitor-web -f
```

### Restart Services
```bash
sudo docker compose -f docker-compose.production.yml restart
```

### Stop Everything
```bash
sudo docker compose -f docker-compose.production.yml down
```

### Rebuild After Changes
```bash
cd /home/node/.openclaw/workspace/server-monitor
git pull
sudo docker compose -f docker-compose.production.yml up -d --build
```

---

## I Need You To Run

Since I don't have sudo/Docker access, please run:

```bash
cd /home/node/.openclaw/workspace/server-monitor
sudo bash deploy-easypanel.sh
```

Then share the output with me so I can help with any issues!

---

**Location**: `/home/node/.openclaw/workspace/server-monitor/deploy-easypanel.sh`
