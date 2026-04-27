# Paylink API Overview

The Paylink API is a RESTful service built with Node.js, Express, and TypeScript. It provides endpoints for payment link management, M-Pesa integration, user authentication, and analytics.

## Base URL

```
Production: https://api.paylink.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Merchants must authenticate to access protected endpoints.

### Authentication Flow

1. **Sign Up**: Create a merchant account
2. **Sign In**: Obtain access and refresh tokens
3. **Use Tokens**: Include Bearer token in Authorization header
4. **Refresh**: Use refresh token to get new access token

### Token Usage

```http
Authorization: Bearer <access_token>
```

## API Design Principles

### RESTful Endpoints

- Resource-based URLs
- HTTP methods for CRUD operations
- Consistent response formats

### Request/Response Format

- **Content-Type**: `application/json`
- **Response Format**: JSON with consistent structure
- **Error Handling**: Standardized error responses

### Rate Limiting

- 200 requests per 15-minute window
- Applied globally to prevent abuse

## Core Resources

### Merchants

- User accounts for business owners
- Authentication and profile management

### Payment Links

- Sharable payment URLs
- Configurable amounts and descriptions
- Status tracking (active, expired, paid)

### Payments

- M-Pesa transaction processing
- STK Push integration
- Payment confirmation via webhooks

### Analytics

- Payment tracking and reporting
- Link performance metrics

## Payment Flow

1. **Merchant** creates a payment link via API
2. **Client** receives the link and enters phone number
3. **System** initiates M-Pesa STK Push
4. **Client** completes payment on their phone
5. **M-Pesa** sends confirmation via webhook
6. **System** generates and emails PDF receipt

## Webhooks

M-Pesa sends payment confirmations to:

```
POST /api/v1/payments/confirm
```

Webhook payload includes transaction details for processing.

## Asynchronous Processing

Payment processing uses Redis and BullMQ for:

- Email delivery
- PDF generation
- Background job processing

Monitor jobs at: `/admin/queues`

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Validation

Requests are validated using Zod schemas shared between frontend and backend. Validation errors return detailed field-level messages.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request protection
- **Rate Limiting**: Request throttling
- **Input Validation**: Comprehensive data validation
- **JWT Authentication**: Secure token-based auth
- **Cookie Security**: HttpOnly, Secure flags

## Data Persistence

- **PostgreSQL**: Primary database with Sequelize ORM
- **Redis**: Caching and session management
- **Migrations**: Database schema versioning with Umzug

## Monitoring & Logging

- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **PM2**: Process management and monitoring
- **BullMQ Dashboard**: Job queue monitoring

## Development Tools

- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development auto-restart
- **Bull Board**: Queue management UI

## Testing

The API includes comprehensive testing setup (to be implemented):

- Unit tests for business logic
- Integration tests for endpoints
- E2E tests for critical flows

## Deployment

The API is containerized with Docker and can be deployed using:

- Docker Compose for development
- Kubernetes/Docker Swarm for production
- PM2 for process management

See [Getting Started](../guides/getting_started.md) for detailed setup instructions.
