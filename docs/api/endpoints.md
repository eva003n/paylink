# Paylink API Endpoints

Complete reference for all Paylink API endpoints. All requests should include `Content-Type: application/json` header.

## Authentication

### Sign Up Merchant

Create a new merchant account.

```http
POST /api/v1/auth/sign-up
```

**Request Body:**

```json
{
  "businessName": "My Business",
  "email": "merchant@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "254712345678"
}
```

**Response (201):**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "merchant-uuid",
    "business_name": "My Business",
    "phone_number": "254712345678",
    "role": "Merchant",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Account created"
}
```

### Sign In

Authenticate and receive JWT tokens.

```http
POST /api/v1/auth/sign-in
```

**Request Body:**

```json
{
  "email": "merchant@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "user": {
      "id": "merchant-uuid",
      "businessName": "My Business",
      "phoneNumber": "254712345678"
    },
    "accessToken": "jwt-access-token",
    "expiresIn": 900000
  },
  "message": "Logged in successfully"
}
```

**Cookies Set:**

- `AccessToken`: HttpOnly, Secure, SameSite=strict, MaxAge=15min
- `RefreshToken`: HttpOnly, Secure, SameSite=strict, MaxAge=1day

### Sign Out

Invalidate the current session.

```http
DELETE /api/v1/auth/sign-out
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {},
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**

- `AccessToken`
- `RefreshToken`

### Refresh Token

Refresh the access token using a valid refresh token cookie or the existing access token.

```http
GET /api/v1/auth/refresh-token
```

**Notes:**

- If the current access token is still valid, the request may return the same token and remaining lifetime.
- If the refresh token cookie is used, the server rotates tokens and returns a new access token.

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "accessToken": "new-jwt-access-token",
    "expiresIn": 900000
  },
  "message": "Refreshed successfully"
}
```

## Payment Links

### Create Payment Link

Generate a new payment link. Requires authentication.

```http
POST /api/v1/links
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "amount": 1000,
  "shortCode": 123456,
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "link-uuid",
    "shortCode": 123456,
    "amount": 1000,
    "url": "http://localhost:5173/pay/encoded-link-id",
    "token": "encoded-link-id",
    "status": "Active",
    "merchant_id": "merchant-uuid",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Link generated successfully"
}
```

### Get Payment Links

List all payment links for the authenticated merchant.

```http
GET /api/v1/links
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (`Active`, `Paid`, `Expired`, `Cancelled`)

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "links": [
      {
        "id": "link-uuid",
        "shortCode": 123456,
        "amount": 1000,
        "url": "http://localhost:5173/pay/encoded-link-id",
        "status": "Active",
        "expiresAt": "2024-12-31T23:59:59.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  },
  "message": "Links fetched successfully"
}
```

### Get Payment Link

Get details of a payment link using its public token.

```http
GET /api/v1/links/link?token=encoded-link-id
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "link-uuid",
    "shortCode": 123456,
    "amount": 1000,
    "status": "Active",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "businessName": "My Business"
  },
  "message": "Link fetched successfully"
}
```

### Update Link Status

Update the status of a payment link.

```http
PATCH /api/v1/links/:id/status
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "status": "Expired"
}
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "link-uuid",
    "shortCode": 123456,
    "url": "http://localhost:5173/pay/encoded-link-id",
    "merchant_id": "merchant-uuid",
    "status": "Expired",
    "amount": 1000,
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Link status updated successfully"
}
```

### Delete Payment Link

Remove a payment link.

```http
DELETE /api/v1/links/:id
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "link-uuid",
    "merchant_id": "merchant-uuid",
    "shortCode": 123456,
    "token": "encoded-link-id",
    "url": "http://localhost:5173/pay/encoded-link-id",
    "amount": 1000,
    "status": "Active",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Link deleted successfully"
}
```

## Payments

### Initiate M-Pesa STK Push

Start a payment process for a payment link.

```http
POST /api/v1/payments/mpesa/stk-push
```

**Request Body:**

```json
{
  "token": "encoded-link-id",
  "email": "customer@example.com",
  "phoneNumber": "254712345678"
}
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "payment-uuid",
    "link_id": "link-uuid",
    "merchant_id": "merchant-uuid",
    "client_id": "client-uuid",
    "amount": 1000,
    "phone_number": "254712345678",
    "email": "customer@example.com",
    "checkout_request_id": "",
    "mpesa_ref": "",
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Mpesa USSD prompt sent to phone number: 254712345678"
}
```

### Get Payment Status

Check the status of a payment.

```http
GET /api/v1/payments/:id/status
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "payment-uuid",
    "status": "Completed",
    "businessName": "My Business",
    "clientEmail": "customer@example.com",
    "phoneNumber": "254712345678",
    "amount": "1000.00",
    "mpesaRef": "MPESA123456",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:05:00.000Z"
  },
  "message": "Payment transaction fetched successfully"
}
```

### Get All Transactions

List all transactions for the authenticated merchant.

```http
GET /api/v1/payments
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (`Pending`, `Completed`, `Cancelled`, `Failed`)

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "status": "Completed",
        "businessName": "My Business",
        "clientName": "customer",
        "phoneNumber": "254712345678",
        "amount": "1000.00",
        "mpesaRef": "MPESA123456",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:05:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  },
  "message": "Payments fetched successfully"
}
```

### M-Pesa Webhook

Handle payment confirmation from M-Pesa. (Internal webhook endpoint)

```http
POST /api/v1/payments/confirm
```

**Note:** This endpoint is called by M-Pesa and does not require authentication.

**Response:**

- HTTP `200 OK`
- No JSON body is returned by the current implementation.

## Analytics

### Get Analytics Overview

Get payment analytics for the authenticated merchant.

```http
GET /api/v1/analytics
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `period`: Time period (day, week, month, year)

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "totalRevenue": 50000,
    "totalTransactions": 50,
    "averageTransaction": 1000,
    "period": "month",
    "chart": {
      "labels": ["Jan", "Feb", "Mar"],
      "data": [15000, 20000, 15000]
    }
  },
  "message": "Analytics generated successfully"
}
```

## User Management

### Get Merchant

Get a merchant's profile by ID.

```http
GET /api/v1/users/:id
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "merchant-uuid",
    "businessName": "My Business",
    "phoneNumber": "254712345678"
  },
  "message": "Merchant fetched successfully"
}
```

## Configuration

### Get System Config

Get system configuration (admin endpoint).

```http
GET /api/v1/configs
Authorization: Bearer <admin_token>
```

## Error Responses

All endpoints may return the following error format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field is required", "Invalid email format"]
}
```

### Common HTTP Status Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `422`: Unprocessable Entity - Validation errors
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting

- **Global Limit**: 200 requests per 15 minutes
- **Headers**: Rate limit information included in responses
- **Reset**: Automatic reset every 15 minutes

## SDKs and Libraries

Currently, the API is consumed directly. Future SDKs may be available for:

- JavaScript/TypeScript
- Python
- PHP

## Changelog

### Version 1.0.0

- Initial API release
- Basic payment link and M-Pesa integration
- Authentication and user management
- Analytics and reporting

## Support

For API support:

- Check this documentation
- Review the [API Overview](overview.md)
- Create an issue in the repository
