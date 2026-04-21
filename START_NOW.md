# Quick Start - Server Monitor

## Current Status

The project is ready but requires:
1. Docker databases to be started (needs elevated permissions)
2. PM2 or manual process management

## To Run Right Now

Since Docker requires sudo, here's what you need to do:

### 1. Start Databases (needs sudo/root)

```bash
cd /home/node/.openclaw/workspace/server-monitor
sudo docker compose up -d
```

Wait ~30 seconds for databases to initialize, then verify:
```bash
sudo docker ps
```

You should see 3 containers: postgres, influxdb, redis

### 2. Start API Server (Terminal 1)

```bash
cd /home/node/.openclaw/workspace/server-monitor/apps/api
yarn dev
```

Should show:
```
✅ Database connected
🚀 Server running on http://localhost:4000
🔌 WebSocket ready
```

### 3. Start Dashboard (Terminal 2)

```bash
cd /home/node/.openclaw/workspace/server-monitor/apps/web
yarn dev
```

Should show:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
✓ Ready in 1449ms
```

### 4. Access

- Dashboard: http://localhost:3000
- API Health: http://localhost:4000/health

## nginx Configuration

Once running, create `/etc/nginx/sites-available/server-monitor.conf`:

```nginx
server {
    listen 80;
    server_name monitor.itsyeasin.com;  # or your subdomain

    # Dashboard
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/server-monitor.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## For Production (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start API (after yarn dev confirms it works)
cd /home/node/.openclaw/workspace/server-monitor/apps/api
pm2 start node_modules/.bin/ts-node --name server-monitor-api -- src/index.ts

# Start Web
cd /home/node/.openclaw/workspace/server-monitor/apps/web
pm2 start npm --name server-monitor-web -- run dev

# Save and auto-start on boot
pm2 save
pm2 startup
```

## SSL

```bash
sudo certbot --nginx -d monitor.itsyeasin.com
```

## Troubleshooting

**If API fails to start:**
- Check databases: `sudo docker ps`
- Check database logs: `sudo docker logs server-monitor-postgres`
- Ensure ports 5432, 6379, 8086 aren't in use

**If Web fails:**
- Check API is running first
- Clear cache: `rm -rf apps/web/.next`

**Check PM2 processes:**
```bash
pm2 list
pm2 logs server-monitor-api
pm2 logs server-monitor-web
```

## Next Steps

1. Run `sudo docker compose up -d` to start databases
2. Start API and Web in separate terminals
3. Test at http://localhost:3000
4. Configure nginx
5. Set up PM2 for production
6. Add SSL

**Location**: `/home/node/.openclaw/workspace/server-monitor`
