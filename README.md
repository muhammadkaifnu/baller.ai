# Smart Football Hub

A monorepo application for intelligent football analytics with web scraping and ML predictions.

## Project Structure

```
Football/
├── client/              # React + Vite frontend
├── server/              # Node.js/Express backend
├── ai-engine/           # Python FastAPI service
├── docker-compose.yml   # Docker orchestration
└── README.md
```

## Services

- **Client (Port 3000)**: React frontend with Tailwind CSS
- **Server (Port 5000)**: Express API for auth and data management
- **AI Engine (Port 8000)**: FastAPI service for ML and web scraping
- **MongoDB (Port 27017)**: Database for all services

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### With Docker Compose

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Server: http://localhost:5000
- AI Engine: http://localhost:8000
- MongoDB: localhost:27017

### Local Development

**Client:**
```bash
cd client
npm install
npm run dev
```

**Server:**
```bash
cd server
npm install
npm run dev
```

**AI Engine:**
```bash
cd ai-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Environment Variables

Copy `.env.example` to `.env` in each service directory and configure as needed.

## API Endpoints

### Server
- `GET /health` - Health check
- `GET /api` - API root

### AI Engine
- `GET /health` - Health check
- `GET /api` - API root
- `GET /api/scrape` - Web scraping endpoint
- `GET /api/predict` - ML prediction endpoint

## Development

Each service has its own package management:
- Client: `package.json` (npm)
- Server: `package.json` (npm)
- AI Engine: `requirements.txt` (pip)
