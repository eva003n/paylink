# Paylink Documentation

Paylink is a comprehensive payment link generation platform designed for freelancers and small service providers in Kenya. It enables professional invoicing and instant mobile money collection through M-Pesa integration, with automatic PDF receipt generation.

## Overview

This monorepo contains a full-stack web application with:

- **Frontend**: React-based dashboard for merchants
- **Backend**: Node.js/Express API server with payment processing
- **Shared**: Common TypeScript utilities and validation schemas
- **Infrastructure**: Docker-based deployment with PostgreSQL and Redis

### High level design
![High level design for paylink](/assets/Diagrams/High-level-diagram.svg)

### Database design
![Database design for paylink](/assets/Diagrams/Entity-relationship-diagram.svg)


## Key Features

- 🔗 **Payment Link Generation**: Create branded, shareable payment links
- 💰 **M-Pesa Integration**: Secure STK Push payment processing
- 📄 **PDF Receipts**: Automatic branded receipt generation and email delivery
- 📊 **Analytics Dashboard**: Track payments and link performance
- 🔒 **Authentication**: Secure merchant accounts with JWT
- 🚀 **Asynchronous Processing**: Redis/BullMQ for reliable job processing

## Architecture

The system follows a client-server architecture with:

- **Frontend**: React SPA served via Nginx
- **Backend**: Express.js API with TypeScript
- **Database**: PostgreSQL for data persistence
- **Cache/Queue**: Redis for session management and job queuing
- **Email**: SMTP integration for notifications
- **Payments**: M-Pesa Daraja API integration

## Documentation Structure

- [Getting Started](./guides/getting_started.md) - Setup and installation guide
- [API Overview](./api/overview.md) - API architecture and concepts
- [API Endpoints](./api/endpoints.md) - Complete API reference

## Quick Start

```bash
# Clone the repository
git clone https://github.com/eva003n/paylink.git
cd paylink

# Start with Docker
docker compose up --build
```

Visit `http://localhost:5173` for the frontend and `http://localhost:8000` for the API.

## Support

For issues and questions, please check the individual documentation files or create an issue in the repository.
