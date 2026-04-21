# Server Monitor - Production Deployment Guide

## Prerequisites

You need to start the databases first since Docker requires elevated permissions.

## Step 1: Start Databases

Run this command with sudo/elevated access:

```bash
cd /home/node/.openclaw/workspace/server-monitor
docker compose up -d
```

This will start:
- PostgreSQL on port 5432
- InfluxDB on port 8086
- Redis on port 6379

## Step 2: Build Production Assets

```bash
# Build Next.js frontend
cd /home/node/.openclaw/workspace/server-monitor/apps/web
yarn build

# Build API
cd /home/node/.openclaw/workspace/server-monitor/apps/api  
yarn build
```

## Step 3: Start Services with PM2

```bash
# Start API server
cd /home/node/.openclaw/workspace/server-monitor/apps/api
pm2 start dist/index.js --name server-monitor-api

# Start Next.js
cd /home/node/.openclaw/workspace/server-monitor/apps/web
pm2 start npm --name server-monitor-web -- start

# Save PM2 config
pm2 save
pm2 startup
```

## Step 4: Configure Nginx

Create `/etc/nginx/sites-available/server-monitor`:

```nginx
# Server Monitor Dashboard
server {
    listen 80;
    server_name monitor.itsyeasin.com;  # Change to your domain

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Server
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/server-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Add SSL with Certbot

```bash
sudo certbot --nginx -d monitor.itsyeasin.com
```

## Step 6: Update Environment for Production

Edit `apps/web/.env.local`:
```
NEXT_PUBLIC_API_URL=https://monitor.itsyeasin.com
```

Restart:
```bash
pm2 restart all
```

## Accessing the Dashboard

- Dashboard: https://monitor.itsyeasin.com
- API Health: https://monitor.itsyeasin.com/api/health

## Monitoring PM2 Services

```bash
pm2 status
pm2 logs server-monitor-web
pm2 logs server-monitor-api
```

## Agent Installation

To monitor other servers, on each target server:

```bash
cd /home/node/.openclaw/workspace/server-monitor/apps/agent
yarn install
cp .env.example .env

# Edit .env with:
# API_URL=https://monitor.itsyeasin.com
# AGENT_TOKEN=<get from dashboard>
# SERVER_ID=<get from dashboard>

yarn build
pm2 start dist/index.js --name server-monitor-agent
pm2 save
```
