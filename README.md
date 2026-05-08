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

### Overview
#### Login page
![Login page](/assets/screenshoots/loginpage.png)
#### Dashboard page
![Dashboard page](/assets/screenshoots/dashboardpage.png)
#### Transactions page
![Transactions page](/assets/screenshoots/transactionspage.png)
#### Links page
![Payment links page](/assets/screenshoots/paymentlinkspage.png)
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

See [API Documentation](./docs/api/endpoints.md) for complete endpoint reference.

### Development
Copy the env variables in the backend/.env.sample as follows 
```bash 
# backend/.env
NODE_ENV=development
PORT=8000
```

```bash
# backend/.env.development 
## Frontend urls
CORS_ORIGIN_URLS=
FRONTEND_BASE_URI=
## Secyrity secrets
COOKIE_SECRET=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
## API documentation
API_DOC_URI=
## Services
POSTGRES_URL=
REDIS_URL=

### (Docker)
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_DB=

## SMTP server
SMTP_MAIL_SERVER=
SMTP_USERNAME=
SMTP_PASSWORD=
# etheral sandbox for emails
SMTP_MAIL_SERVER_PORT=
APP_EMAIL=

## M-Pesa config
CONSUMER_KEY=
CONSUMER_SECRET=
MPESA_API_URL=
MPESA_AUTH_URL=
MPESA_EXPRESS_CALLBACK_URL=
MPESA_EXPRESS_PASSKEY=
MPESA_SHORTCODE=
MPESA_PARTYA=
```

#### Available Scripts
Must have node js and pnpm preinstalled

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:backend    # Start backend on port 8000
pnpm dev:frontend   # Start frontend on port 5173
```

#### Docker 
```bash
docker compose -f decker-compose.dev.yaml up
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


### Deployment

#### Docker Production

```bash
# Build and run in production
docker compose -f docker-compose.yml up --build -d
```
### Support

For support and questions:

- Check the [documentation](./docs/)
- Create an issue on GitHub
- Review the [API documentation](./docs/api/endpoints.md)
