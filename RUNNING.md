# Server Monitor - Installation & Running Guide

## 🚀 Quick Start (Simplified)

This project uses individual package management instead of workspaces for better compatibility.

### 1. Install Dependencies

```bash
# Install each package separately
cd packages/types && yarn install && cd ../..
cd apps/api && yarn install && cd ../..
cd apps/web && yarn install && cd ../..
cd apps/agent && yarn install && cd ../..
```

### 2. Start Databases

```bash
docker compose up -d
```

### 3. Build Shared Types

```bash
cd packages/types
yarn build
cd ../..
```

### 4. Run Development Servers

Open 3 separate terminals:

**Terminal 1 - API Server:**
```bash
cd apps/api
cp .env.example .env
yarn dev
```

**Terminal 2 - Dashboard:**
```bash
cd apps/web
cp .env.local.example .env.local
yarn dev
```

**Terminal 3 - Agent (optional, for testing):**
```bash
cd apps/agent
cp .env.example .env
# Edit .env with SERVER_ID and AGENT_TOKEN
yarn dev
```

## 📍 Access

- Dashboard: http://localhost:3000
- API: http://localhost:4000

## 🐛 Troubleshooting

If you see TypeScript errors, make sure you built the types package first:
```bash
cd packages/types && yarn build
```

## 💡 Production Build

```bash
cd packages/types && yarn build
cd ../../apps/api && yarn build && yarn start
cd ../web && yarn build && yarn start
```
