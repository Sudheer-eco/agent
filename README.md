# AgentOps Monorepo

This repository contains a minimal demo of an AgentOps system with a Next.js frontend and an Express backend. It provides a simple login flow and a task-based chat interface.

## Structure

- `frontend/` – Next.js application
- `backend/` – Express REST API

## Running locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Both servers run on their default ports (Backend: `3001`, Frontend: `3000`). The frontend proxies API requests to the backend during development.

