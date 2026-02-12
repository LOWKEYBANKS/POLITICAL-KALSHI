# Political-Kalshi API Documentation

Complete API reference for Political-Kalshi prediction market platform.

## Base URL

```
Development: http://localhost:3001
Production: https://api.political-kalshi.ke
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer {accessToken}
```

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "password": "securePassword123",
  "name": "John Doe",
  "email": "john@example.com",
  "isPolitician": false
}
```

**Response:**
```json
{
  "user": {
    "id": "USR-123456",
    "phoneNumber": "+254712345678",
    "name": "John Doe",
    "role": "CITIZEN",
    "kycStatus": "PENDING",
    "balanceKES": 0
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "password": "securePassword123"
}
```

### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": "USR-123456",
  "phoneNumber": "+254712345678",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CITIZEN",
  "kycStatus": "PENDING",
  "isPolitician": false,
  "balanceKES": 5000,
  "createdAt": "2026-02-12T10:00:00Z"
}
```

### Submit KYC

```http
POST /api/auth/kyc
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "documentUrl": "https://s3.amazonaws.com/kyc/document.pdf"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword123"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

---

## Market Endpoints

### Create Market

```http
POST /api/markets
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "question": "Will Raila win the 2027 election?",
  "description": "Prediction market for 2027 Kenyan presidential election",
  "category": "ELECTION",
  "resolutionDate": "2027-08-09T00:00:00Z",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["election", "2027", "politics"]
}
```

**Response:**
```json
{
  "id": "POLL-1707734400000-a1b2c3d4",
  "question": "Will Raila win the 2027 election?",
  "description": "Prediction market for 2027 Kenyan presidential election",
  "category": "ELECTION",
  "status": "OPEN",
  "yesOdds": 0.5,
  "noOdds": 0.5,
  "resolutionDate": "2027-08-09T00:00:00Z",
  "createdAt": "2026-02-12T10:00:00Z"
}
```

### Get All Markets

```http
GET /api/markets?status=OPEN&category=ELECTION&search=election
```

**Query Parameters:**
- `status` - Market status (OPEN, CLOSING, CLOSED, SETTLED)
- `category` - Market category (ELECTION, DEBATE, SCANDAL, POLICY, ECONOMIC, SOCIAL)
- `search` - Search query

**Response:**
```json
{
  "markets": [
    {
      "id": "POLL-1707734400000-a1b2c3d4",
      "question": "Will Raila win the 2027 election?",
      "category": "ELECTION",
      "status": "OPEN",
      "yesOdds": 0.52,
      "noOdds": 0.48,
      "totalVolume": 150000,
      "resolutionDate": "2027-08-09T00:00:00Z",
      "createdAt": "2026-02-12T10:00:00Z"
    }
  ]
}
```

### Get Market by ID

```http
GET /api/markets/{marketId}
```

### Get Trending Markets

```http
GET /api/markets/trending/markets?limit=10
```

### Get Closing Markets

```http
GET /api/markets/closing/markets?hours=24
```

### Get Markets by Category

```http
GET /api/markets/category/{category}
```

### Get User's Markets

```http
GET /api/markets/user/{userId}
Authorization: Bearer {accessToken}
```

---

## Payment Endpoints

### Initiate Deposit

```http
POST /api/payments/deposit
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "amount": 1000
}
```

**Response:**
```json
{
  "paymentId": "PAY-1707734400000-a1b2c3d4",
  "status": "PENDING",
  "message": "M-Pesa prompt sent to your phone. Please enter your PIN to complete the transaction.",
  "amount": 1000
}
```

### Get Payment Status

```http
GET /api/payments/{paymentId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": "PAY-1707734400000-a1b2c3d4",
  "status": "COMPLETED",
  "type": "DEPOSIT",
  "amount": 1000,
  "phoneNumber": "+254712345678",
  "mpesaReceiptNumber": "LHD31H500V6",
  "createdAt": "2026-02-12T10:00:00Z",
  "completedAt": "2026-02-12T10:01:30Z"
}
```

### Get User Payments

```http
GET /api/payments?type=DEPOSIT&status=COMPLETED
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `type` - Payment type (DEPOSIT, WITHDRAWAL)
- `status` - Payment status (INITIATED, PENDING, COMPLETED, FAILED, CANCELLED)

### Initiate Withdrawal

```http
POST /api/payments/withdraw
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phoneNumber": "+254712345678",
  "amount": 500
}
```

### M-Pesa Callback (Webhook)

```http
POST /api/payments/callback
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "CheckoutRequestID": "ws_CO_DMZ_123456789",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {
            "Name": "Amount",
            "Value": 1000
          },
          {
            "Name": "MpesaReceiptNumber",
            "Value": "LHD31H500V6"
          },
          {
            "Name": "TransactionDate",
            "Value": 20260212100000
          },
          {
            "Name": "PhoneNumber",
            "Value": 254712345678
          }
        ]
      }
    }
  }
}
```

---

## Order Endpoints

### Place Order

```http
POST /api/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "marketId": "POLL-1707734400000-a1b2c3d4",
  "side": "YES",
  "quantity": 1000,
  "limitPrice": 0.55
}
```

**Response:**
```json
{
  "id": "ORD-1707734400000-a1b2c3d4",
  "userId": "USR-123456",
  "marketId": "POLL-1707734400000-a1b2c3d4",
  "side": "YES",
  "quantity": 1000,
  "limitPrice": 0.55,
  "status": "FILLED",
  "filledQuantity": 1000,
  "averagePrice": 0.54,
  "createdAt": "2026-02-12T10:00:00Z"
}
```

### Get Order

```http
GET /api/orders/{orderId}
Authorization: Bearer {accessToken}
```

### Get User Orders

```http
GET /api/orders?marketId={marketId}
Authorization: Bearer {accessToken}
```

### Cancel Order

```http
DELETE /api/orders/{orderId}
Authorization: Bearer {accessToken}
```

---

## Portfolio Endpoints

### Get Portfolio Overview

```http
GET /api/portfolio
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "totalValue": 5000,
  "realizedPnL": 250,
  "unrealizedPnL": 100,
  "winRate": 0.65,
  "totalTrades": 20,
  "openPositions": 3
}
```

### Get Positions

```http
GET /api/portfolio/positions
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "positions": [
    {
      "marketId": "POLL-1707734400000-a1b2c3d4",
      "question": "Will Raila win the 2027 election?",
      "yesQuantity": 500,
      "noQuantity": 0,
      "averageYesPrice": 0.54,
      "unrealizedPnL": 50,
      "currentPrice": 0.56
    }
  ]
}
```

### Get Transaction History

```http
GET /api/portfolio/history?limit=50&offset=0
Authorization: Bearer {accessToken}
```

### Get Leaderboard

```http
GET /api/portfolio/leaderboard?period=all&limit=100
```

**Query Parameters:**
- `period` - Time period (day, week, month, all)
- `limit` - Number of results (max 100)

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_CREDENTIALS | 401 | Invalid phone number or password |
| INVALID_TOKEN | 401 | Invalid or expired token |
| INSUFFICIENT_BALANCE | 400 | Insufficient account balance |
| MARKET_CLOSED | 400 | Market is closed for trading |
| INVALID_ORDER | 400 | Invalid order parameters |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |

---

## Rate Limiting

API endpoints are rate limited:
- **General endpoints**: 100 requests per minute
- **Auth endpoints**: 5 requests per 15 minutes
- **Payment endpoints**: 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707734460
```

---

## WebSocket Events

Connect to WebSocket at `ws://localhost:3001`:

### Subscribe to Market

```javascript
socket.emit('subscribe_market', { market_id: 'POLL-xxx' });
```

### Receive Market Updates

```javascript
socket.on('market_update', (data) => {
  // {
  //   marketId: 'POLL-xxx',
  //   yesOdds: 0.55,
  //   noOdds: 0.45,
  //   totalVolume: 150000
  // }
});
```

### Place Order via WebSocket

```javascript
socket.emit('place_order', {
  marketId: 'POLL-xxx',
  side: 'YES',
  quantity: 1000,
  limitPrice: 0.55
});
```

### Order Confirmation

```javascript
socket.on('order_filled', (data) => {
  // {
  //   orderId: 'ORD-xxx',
  //   filledQuantity: 1000,
  //   averagePrice: 0.54
  // }
});
```

---

## Examples

### Complete Trading Flow

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "password": "password123",
    "name": "John Doe"
  }'

# 2. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "password": "password123"
  }'

# 3. Deposit funds
curl -X POST http://localhost:3001/api/payments/deposit \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "amount": 1000
  }'

# 4. Get markets
curl http://localhost:3001/api/markets?status=OPEN

# 5. Place order
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": "POLL-xxx",
    "side": "YES",
    "quantity": 500,
    "limitPrice": 0.55
  }'
```

---

## Support

For API support:
- Email: api-support@political-kalshi.ke
- GitHub Issues: https://github.com/LOWKEYBANKS/POLITICAL-KALSHI/issues
- Status Page: https://status.political-kalshi.ke

---

**Last Updated:** February 2026
**API Version:** 1.0.0
