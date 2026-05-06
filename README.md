# LatviaEssential

Web scraping and notification service built with NestJS.

## Tech Stack

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ (Redis-backed)
- **Scraping**: Playwright + Cheerio
- **Notifications**: Discord.js
- **AI**: OpenRouter (OpenAI-compatible API)
- **Infrastructure**: Docker + docker-compose

## Project Structure

```
src/
  common/               # Shared utilities, decorators, filters, guards
  config/               # Application configuration
  modules/
    listings/           # Listing entities and CRUD
    scraper/            # Web scraping logic (Playwright + Cheerio)
    discord/            # Discord bot integration
    queue/              # BullMQ job queue management
    database/           # Prisma service and database utilities
    notifications/      # Notification dispatch (Discord, etc.)
    openrouter/         # OpenRouter AI integration
```

## Prerequisites

- **Node.js** >= 22
- **npm** >= 10
- **Docker** + Docker Compose (for PostgreSQL & Redis)
- **PostgreSQL** 17 (if running without Docker)
- **Redis** 7 (if running without Docker)

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url> latvia-essential
cd latvia-essential
cp .env.example .env
npm ci
```

### 2. Start Infrastructure

```bash
docker compose up -d postgres redis
```

### 3. Initialize Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the App

```bash
npm run start:dev
```

The API runs at **http://localhost:3000/api**.

### 5. Full Docker Setup

```bash
# Build and run everything
docker compose up -d --build
```

## Environment Variables

See `.env.example` for the full list of configuration options.

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `REDIS_HOST` | Yes | `localhost` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `DISCORD_BOT_TOKEN` | No | — | Discord bot token |
| `OPENROUTER_API_KEY` | No | — | OpenRouter API key |
| `SCRAPER_REQUEST_DELAY_MS` | No | `2000` | Delay between requests |

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |

## Prisma

```bash
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Create and apply migrations
npm run prisma:studio     # Open database GUI
```
