# Deploy Server Monitor on Easypanel

## Method 1: Using Easypanel's GitHub Integration (Recommended)

### Step 1: Prepare Repository
Your repository is ready at: `https://github.com/its-yeasin/server-monitor`

### Step 2: In Easypanel Dashboard

1. **Create New Project**
   - Click "Create Project"
   - Name: `server-monitor`

2. **Add PostgreSQL Service**
   - Add Service → Database → PostgreSQL
   - Name: `postgres`
   - Database: `servermonitor`
   - Username: `monitor`
   - Password: `monitor123`
   - Keep default port 5432

3. **Add Redis Service**
   - Add Service → Database → Redis
   - Name: `redis`
   - Keep default port 6379

4. **Add InfluxDB Service**
   - Add Service → App → Custom
   - Name: `influxdb`
   - Image: `influxdb:2.7-alpine`
   - Port: 8086
   - Environment Variables:
     ```
     DOCKER_INFLUXDB_INIT_MODE=setup
     DOCKER_INFLUXDB_INIT_USERNAME=admin
     DOCKER_INFLUXDB_INIT_PASSWORD=admin123456
     DOCKER_INFLUXDB_INIT_ORG=servermonitor
     DOCKER_INFLUXDB_INIT_BUCKET=metrics
     DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-auth-token
     ```
   - Mount: `/var/lib/influxdb2` (persistent)

5. **Add API Service**
   - Add Service → App → From GitHub
   - Repository: `its-yeasin/server-monitor`
   - Branch: `main`
   - Build Method: Dockerfile
   - Dockerfile Path: `apps/api/Dockerfile`
   - Port: 4000
   - Environment Variables:
     ```
     DATABASE_URL=postgresql://monitor:monitor123@postgres:5432/servermonitor
     INFLUXDB_URL=http://influxdb:8086
     INFLUXDB_TOKEN=my-super-secret-auth-token
     INFLUXDB_ORG=servermonitor
     INFLUXDB_BUCKET=metrics
     REDIS_URL=redis://redis:6379
     JWT_SECRET=your-secret-key-here
     PORT=4000
     ```
   - Domain: `monitor-api.itsyeasin.com` (or your choice)

6. **Add Web Dashboard Service**
   - Add Service → App → From GitHub
   - Repository: `its-yeasin/server-monitor`
   - Branch: `main`
   - Build Method: Dockerfile
   - Dockerfile Path: `apps/web/Dockerfile`
   - Port: 3000
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://monitor-api.itsyeasin.com
     ```
   - Domain: `monitor.itsyeasin.com`

### Step 3: Enable SSL
Easypanel automatically provisions SSL certificates. Just ensure your domains point to the Easypanel server.

### Step 4: Access
- Dashboard: `https://monitor.itsyeasin.com`
- API: `https://monitor-api.itsyeasin.com/health`

---

## Method 2: Using Docker Compose (Easier for Testing)

### Step 1: Clone on Easypanel Server

```bash
cd /opt
git clone https://github.com/its-yeasin/server-monitor.git
cd server-monitor
```

### Step 2: Use Production Compose File

```bash
docker compose -f docker-compose.production.yml up -d --build
```

This starts all services:
- PostgreSQL on port 5432
- InfluxDB on port 8086
- Redis on port 6379
- API on port 4000
- Web on port 3000

### Step 3: Configure Domains in Easypanel

1. Go to Easypanel → Domains
2. Add domain for port 3000: `monitor.itsyeasin.com`
3. Add domain for port 4000: `monitor-api.itsyeasin.com`
4. Enable SSL

---

## Method 3: Manual Docker Commands (if Compose not available)

### 1. Create Network
```bash
docker network create monitor-network
```

### 2. Start Databases
```bash
# PostgreSQL
docker run -d \
  --name server-monitor-postgres \
  --network monitor-network \
  -e POSTGRES_DB=servermonitor \
  -e POSTGRES_USER=monitor \
  -e POSTGRES_PASSWORD=monitor123 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Redis
docker run -d \
  --name server-monitor-redis \
  --network monitor-network \
  -v redis_data:/data \
  redis:7-alpine

# InfluxDB
docker run -d \
  --name server-monitor-influxdb \
  --network monitor-network \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=admin123456 \
  -e DOCKER_INFLUXDB_INIT_ORG=servermonitor \
  -e DOCKER_INFLUXDB_INIT_BUCKET=metrics \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-auth-token \
  -v influxdb_data:/var/lib/influxdb2 \
  influxdb:2.7-alpine
```

### 3. Build and Run API
```bash
cd /opt/server-monitor
docker build -f apps/api/Dockerfile -t server-monitor-api .

docker run -d \
  --name server-monitor-api \
  --network monitor-network \
  -p 4000:4000 \
  -e DATABASE_URL=postgresql://monitor:monitor123@server-monitor-postgres:5432/servermonitor \
  -e INFLUXDB_URL=http://server-monitor-influxdb:8086 \
  -e INFLUXDB_TOKEN=my-super-secret-auth-token \
  -e INFLUXDB_ORG=servermonitor \
  -e INFLUXDB_BUCKET=metrics \
  -e REDIS_URL=redis://server-monitor-redis:6379 \
  -e JWT_SECRET=change-this-secret \
  server-monitor-api
```

### 4. Build and Run Web
```bash
docker build -f apps/web/Dockerfile -t server-monitor-web .

docker run -d \
  --name server-monitor-web \
  --network monitor-network \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://server-monitor-api:4000 \
  server-monitor-web
```

---

## Troubleshooting

### Check Logs
```bash
docker logs server-monitor-api
docker logs server-monitor-web
docker logs server-monitor-postgres
```

### Restart Services
```bash
docker compose -f docker-compose.production.yml restart
```

### Rebuild After Code Changes
```bash
git pull
docker compose -f docker-compose.production.yml up -d --build
```

---

## Recommended Setup for Easypanel

**Method 1 (GitHub Integration)** is best because:
- ✅ Automatic deploys on git push
- ✅ Built-in SSL
- ✅ Easy domain management
- ✅ Integrated logging
- ✅ Resource monitoring

Choose this if you want production-grade deployment with CI/CD!
