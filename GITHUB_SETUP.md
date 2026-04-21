# GitHub Setup Instructions

## Option 1: Using Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Server Monitor"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

Then run these commands:

```bash
cd /home/node/.openclaw/workspace/server-monitor

# Set your git identity
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Create a new GitHub repository first at github.com/new
# Then run:

git init
git add .
git commit -m "Initial commit: Server monitoring tool with agents"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/server-monitor.git
git push -u origin main

# When prompted for username: use your GitHub username
# When prompted for password: paste your Personal Access Token
```

## Option 2: Using SSH Keys

If you already have SSH keys set up:

```bash
cd /home/node/.openclaw/workspace/server-monitor

git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

git init
git add .
git commit -m "Initial commit: Server monitoring tool with agents"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/server-monitor.git
git push -u origin main
```

---

## Quick Commands for Me to Run

Once you provide your details, I'll run:

```bash
git config --global user.name "Fahim"
git config --global user.email "YOUR_EMAIL"
cd /home/node/.openclaw/workspace/server-monitor
git init
git add .
git commit -m "Initial commit: Professional server monitoring tool

Features:
- Multi-server dashboard with real-time metrics
- Lightweight agents for CPU, RAM, Disk, Network monitoring
- WebSocket live updates
- Next.js 14 + React + TailwindCSS frontend
- Node.js + Express + TypeScript backend
- PostgreSQL + InfluxDB + Redis
- Docker Compose setup for easy deployment"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/server-monitor.git
git push -u origin main
```

---

## What I Need From You

1. Your GitHub username
2. Your email (for git commits)
3. Your Personal Access Token (create one following Option 1 above)

OR

Just tell me to proceed and I'll prepare everything locally, then you can push it yourself!
