# Getting Started with Paylink

This guide will help you set up Paylink locally for development or deployment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose**: For containerized deployment
- **Node.js 18+**: For local development (optional with Docker)
- **pnpm**: Package manager for the monorepo
- **Git**: For cloning the repository

## Quick Setup with Docker

The fastest way to get Paylink running is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/eva003n/paylink.git
cd paylink

# Start all services
docker compose up --build
```

This will start:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **PostgreSQL Database**: localhost:5432
- **Redis**: localhost:6379
- **BullMQ Dashboard**: http://localhost:8000/admin/queues

## Manual Development Setup

If you prefer to run services individually for development:

### 1. Environment Configuration

Copy environment files and configure them:

```bash
# Backend environment
cp backend/.env.example backend/.env.development

# Frontend environment
cp frontend/.env.example frontend/.env.development
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Build shared packages first
pnpm build:shared
```

### 3. Database Setup

```bash
# Start PostgreSQL (via Docker or local)
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:18

# Run migrations
pnpm --filter backend run migrate
```

### 4. Start Services

```bash
# Terminal 1: Start backend
pnpm dev:backend

# Terminal 2: Start frontend
pnpm dev:frontend
```

## Configuration

### Required Environment Variables

#### Backend (.env.development)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/paylink

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# M-Pesa API (Sandbox)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=your-shortcode
MPESA_PASSKEY=your-passkey

# Email (Brevo/SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-smtp-password

# App
PORT=8000
NODE_ENV=development
CORS_ORIGIN_URLS=http://localhost:5173
```

#### Frontend (.env.development)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Development Workflow

### Building the Project

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:backend
pnpm build:frontend
pnpm build:shared
```

### Running Tests

```bash
# Run tests (when implemented)
pnpm test
```

### Database Operations

```bash
# Create new migration
pnpm --filter backend run make:migration

# Run migrations
pnpm --filter backend run migrate
```

## Deployment

### Production with Docker

1. Configure production environment files:
   - `backend/.env.production`
   - `frontend/.env.production`

2. Build and deploy:
   ```bash
   docker compose -f docker-compose.yml up --build -d
   ```

### Environment Checklist

Before going live, ensure:

- [ ] M-Pesa credentials are configured for production
- [ ] Email service is configured
- [ ] Database is backed up
- [ ] SSL certificates are set up
- [ ] Domain is configured
- [ ] Environment variables are secure

## Troubleshooting

### Common Issues

**Database Connection Failed**

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**Redis Connection Failed**

- Ensure Redis service is running
- Check REDIS_URL configuration

**M-Pesa Integration Issues**

- Verify sandbox/production credentials
- Check callback URLs in M-Pesa developer portal

**Email Not Sending**

- Verify SMTP credentials
- Check spam folder
- Ensure correct SMTP host/port

### Logs

View application logs:

```bash
# Docker logs
docker compose logs -f

# PM2 logs (production)
pm2 logs
```

### Health Checks

- **API Health**: `GET /api/v1/health` (if implemented)
- **Database**: Check PostgreSQL connection
- **Redis**: `redis-cli ping`

## Next Steps

Once set up, you can:

1. [Create a merchant account](./api/endpoints.md#authentication)
2. [Generate payment links](./api/endpoints.md#payment-links)
3. [Monitor payments](./api/endpoints.md#analytics)

For detailed API documentation, see the [API Endpoints](./api/endpoints.md) guide.
