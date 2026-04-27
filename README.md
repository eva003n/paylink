## Paylink

### Introduction

A complete end-to-end payment link generator. Business owners can create a unique link, share it with a client, and handle the entire M-Pesa checkout process gracefully. Upon successful payment, a branded PDF receipt is automatically generated and sent to the client.

### Problem

Freelancers or small service providers who need a professional way to invoice clients and collect mobile money payments instantly without writing complex integration code.

### Features

- Link generation and management
- Payment processing(Mobile money)
- Receipt generation(Sent to email)

### Challenges

- Handling payment processing reliably
- Creting a simple monorepo to share code bet frontend and backend, single source of truth for validation

### Technologies

- React + Tailwind CSS(**UI**))
- Node js + Typescript + Express(**Server logic**)
- Redis + Bull MQ(**Asynchronous payment processing**)
- Pdfkit(**Pdf generation**)
- Node mailer + Brevo(**Email sending**))
- Pm2 (**Process management**)

### Launch

#### Step 1: Clone the repository

Run inside terminal

```bash
git clone https://github.com/eva003n/paylink.git
```

Move to paylink directory

```bash
cd paylink
```

#### Docker

Must have docker pre-installed

```bash
 docker compose up --build
```

### Usage

#### For Merchants

1. **Sign Up**: Create your merchant account at `http://localhost:5173`
2. **Create Payment Links**: Use the dashboard to generate payment links
3. **Share Links**: Send payment links to your clients via email, WhatsApp, or any method
4. **Track Payments**: Monitor payments and view analytics in the dashboard

#### For Clients

1. **Receive Link**: Get the payment link from the merchant
2. **Enter Details**: Visit the link and enter your phone number
3. **Complete Payment**: Follow M-Pesa STK Push instructions on your phone
4. **Receive Receipt**: Get automatic PDF receipt via email

### API Usage

The Paylink API provides programmatic access to all features:

```bash
# Example: Create a payment link
curl -X POST http://localhost:8000/api/v1/links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "description": "Website Development",
    "customerEmail": "client@example.com"
  }'
```

See [API Documentation](./docs/api/endpoints.md) for complete endpoint reference.

### Development

#### Available Scripts

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:backend    # Start backend on port 8000
pnpm dev:frontend   # Start frontend on port 5173
```

#### Project Structure

```
paylink/
├── backend/          # Node.js/Express API server
├── frontend/         # React SPA
├── shared/           # Common validation schemas
├── docs/             # Documentation
├── docker-compose.yaml
└── package.json
```

### Documentation

- **[Getting Started](./docs/guides/getting_started.md)** - Setup and installation
- **[API Overview](./docs/api/overview.md)** - API architecture and concepts
- **[API Endpoints](./docs/api/endpoints.md)** - Complete API reference
- **[Main Documentation](./docs/README.md)** - Project overview and guides

### Environment Variables

#### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: JWT signing secret
- `MPESA_CONSUMER_KEY`: M-Pesa API credentials
- `SMTP_HOST`: Email SMTP configuration

#### Frontend

- `VITE_API_BASE_URL`: Backend API URL

### Deployment

#### Docker Production

```bash
# Build and run in production
docker compose -f docker-compose.yml up --build -d
```

#### Manual Deployment

```bash
# Build all services
pnpm build

# Start with PM2
pnpm --filter backend start
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### License

ISC License - see LICENSE file for details.

### Support

For support and questions:

- Check the [documentation](./docs/)
- Create an issue on GitHub
- Review the [API documentation](./docs/api/endpoints.md)
