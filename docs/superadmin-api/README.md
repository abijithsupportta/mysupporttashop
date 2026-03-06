# Superadmin API Documentation for Flutter

This document is the source of truth for integrating Flutter apps with the Superadmin backend.

## API base

- Production: `https://<your-superadmin-domain>/api/v1`
- Preview: `https://<your-preview-domain>/api/v1`

Use **only** `/api/v1/*` in Flutter clients.

## Authentication model

Auth is cookie-session based (Supabase session cookies), not bearer-token based.

1. Call `POST /auth/login`.
2. Persist cookies in your HTTP client.
3. Send the same cookie jar for all protected requests.
4. Optionally call `POST /auth/refresh` before expiry.

### Protected vs public endpoints

- Public: `GET /health`, `POST /auth/login`
- Protected (superadmin required): everything else

If auth is missing/invalid, protected endpoints return `401`.
If user is authenticated but not superadmin, endpoints return `403`.

## Standard response envelopes

### Success envelope

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### Error envelope

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field_errors": {
      "email": ["Invalid email"]
    }
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### Paginated envelope

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 124,
    "page": 1,
    "limit": 10,
    "total_pages": 13,
    "has_next": true,
    "has_prev": false
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

Some paginated endpoints include extra fields in addition to `meta`.
Example: `GET /orders` also includes `summary`, `sort_by`, and `sort_order`.

## Endpoint index

- Auth
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- Health
- `GET /health`
- Dashboard
- `GET /dashboard`
- Orders
- `GET /orders`
- `GET /orders/{id}`
- `PATCH /orders/{id}/status`
- Vendors
- `GET /vendors`
- `POST /vendors`
- `GET /vendors/{id}`
- `PATCH /vendors/{id}`
- `DELETE /vendors/{id}`
- `PATCH /vendors/{id}/status`
- `GET /vendors/{id}/products`
- Analytics
- `GET /analytics/revenue`
- `GET /analytics/vendors/top`
- Email
- `POST /email/test`

## Endpoint details

### 1) Login

- Method: `POST /auth/login`
- Auth: Public
- Rate limit: enabled
- Body:

```json
{
  "email": "info@supporttasolutions.com",
  "password": "your_password"
}
```

- Success `200`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "info@supporttasolutions.com"
    }
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`, `429`

### 2) Logout

- Method: `POST /auth/logout`
- Auth: Superadmin
- Body: none
- Success `200`:

```json
{
  "success": true,
  "data": {
    "message": "Logged out"
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### 3) Refresh session

- Method: `POST /auth/refresh`
- Auth: Existing session required
- Body: none
- Success `200`:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "info@supporttasolutions.com"
    },
    "expires_at": 1710000000
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Error: `401`

### 4) Health

- Method: `GET /health`
- Auth: Public
- Success `200`:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "environment": "production"
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### 5) Dashboard stats

- Method: `GET /dashboard`
- Auth: Superadmin
- Success `200`: `data` contains dashboard aggregates and recent records
- Errors: `401`, `403`

### 6) List orders

- Method: `GET /orders`
- Auth: Superadmin
- Query params:
- `page` default `1`
- `limit` default `10` max `100`
- `search` default `""`
- `sort_by` default `created_at`
- `sort_order` `asc | desc`, default `desc`
- `order_status` `all | pending | processing | shipped | delivered | cancelled`, default `all`
- `payment_status` `all | pending | paid | failed | refunded`, default `all`
- `vendor_id` default `all`
- `from_date` optional
- `to_date` optional

- Success `200` sample:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  },
  "summary": {
    "total_revenue": 0,
    "total_commission": 0
  },
  "sort_by": "created_at",
  "sort_order": "desc",
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`

### 7) Get single order

- Method: `GET /orders/{id}`
- Auth: Superadmin
- Success `200`: `ApiResponse<Order>`
- Errors: `401`, `403`, `404`

### 8) Update order status

- Method: `PATCH /orders/{id}/status`
- Auth: Superadmin
- Body:

```json
{
  "order_status": "processing"
}
```

Allowed values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

- Success `200`: `ApiResponse<Order>`
- Errors: `400`, `401`, `403`, `404`

### 9) List vendors

- Method: `GET /vendors`
- Auth: Superadmin
- Query params:
- `page` default `1`
- `limit` default `10` max `100`
- `search` default `""`
- `sort_by` default `created_at`
- `sort_order` `asc | desc`, default `desc`
- `status` `all | active | suspended`, default `all`

- Success `200`: paginated vendors with `meta`
- Errors: `400`, `401`, `403`

### 10) Create vendor

- Method: `POST /vendors`
- Auth: Superadmin
- Body (required unless noted):
- `email`, `password`, `full_name`, `phone`
- `owner_role` (`vendor_owner` or `shop_owner`, default `vendor_owner`)
- `is_active` (default `true`)
- `store_name`, `address`, `city`, `state`, `district`, `pincode`
- `slug` (optional)
- `description` (optional)
- `logo_url` (optional, valid URL or empty string)
- `banner_url` (optional, valid URL or empty string)
- `theme_id` (optional)
- `primary_color` (optional)

- Success `200`: `ApiResponse<Vendor>`
- Errors: `400`, `401`, `403`, `409`

### 11) Get vendor detail

- Method: `GET /vendors/{id}`
- Auth: Superadmin
- Query params: `page`, `limit` (for embedded orders)
- Success `200` includes:
- `vendor`
- `products`
- `orders`
- `orders_total`, `orders_page`, `orders_limit`, `orders_total_pages`

- Errors: `401`, `403`, `404`

### 12) Update vendor

- Method: `PATCH /vendors/{id}`
- Auth: Superadmin
- Body: any subset of vendor/store updatable fields
- Success `200`: `ApiResponse<Vendor>`
- Errors: `400`, `401`, `403`, `404`

### 13) Delete vendor

- Method: `DELETE /vendors/{id}`
- Auth: Superadmin
- Success `200`:

```json
{
  "success": true,
  "data": {
    "message": "Vendor deleted"
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`

### 14) Update vendor status

- Method: `PATCH /vendors/{id}/status`
- Auth: Superadmin
- Body:

```json
{
  "is_active": false
}
```

- Success `200`: `ApiResponse<Vendor>`
- Errors: `400`, `401`, `403`, `404`

### 15) Vendor products (paginated)

- Method: `GET /vendors/{id}/products`
- Auth: Superadmin
- Query params: `page`, `limit`, `search`, `sort_by`, `sort_order`
- Success `200`: paginated response with `meta`
- Errors: `400`, `401`, `403`

### 16) Revenue analytics

- Method: `GET /analytics/revenue`
- Auth: Superadmin
- Query params: `days` (integer `1..365`, default `30`)
- Success `200`:

```json
{
  "success": true,
  "data": {
    "days": 30,
    "points": [
      {
        "date": "2026-03-01",
        "revenue": 15000,
        "commission": 1200,
        "orders": 8
      }
    ]
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`

### 17) Top vendors analytics

- Method: `GET /analytics/vendors/top`
- Auth: Superadmin
- Query params: `limit` (integer `1..50`, default `10`)
- Success `200`:

```json
{
  "success": true,
  "data": {
    "limit": 10,
    "vendors": [
      {
        "vendor_id": "uuid",
        "vendor_name": "Vendor Name",
        "vendor_email": "vendor@example.com",
        "total_revenue": 50000,
        "total_commission": 4000,
        "total_orders": 25
      }
    ]
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`

### 18) Send test email

- Method: `POST /email/test`
- Auth: Superadmin
- Body (optional):

```json
{
  "to": "qa@example.com"
}
```

If body is omitted, backend sends to default test email.

- Success `200`:

```json
{
  "success": true,
  "data": {
    "to": "qa@example.com",
    "message": "Test email sent successfully"
  },
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

- Errors: `400`, `401`, `403`, `500`

## Flutter integration guidance

### Dio + cookie persistence

Use one shared Dio instance with cookie jar.

```dart
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';

final dio = Dio(BaseOptions(
  baseUrl: 'https://your-superadmin-domain/api/v1',
  connectTimeout: const Duration(seconds: 20),
  receiveTimeout: const Duration(seconds: 20),
  headers: {'Content-Type': 'application/json'},
));

final cookieJar = CookieJar();
dio.interceptors.add(CookieManager(cookieJar));
```

### Flutter envelope models

```dart
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;
  final Object? details;
  final String? timestamp;

  ApiResponse({
    required this.success,
    this.data,
    this.error,
    this.details,
    this.timestamp,
  });
}

class PaginationMeta {
  final int total;
  final int page;
  final int limit;
  final int totalPages;
  final bool hasNext;
  final bool hasPrev;

  PaginationMeta({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });
}

class PaginatedResponse<T> {
  final bool success;
  final List<T> data;
  final PaginationMeta meta;
  final String? timestamp;

  PaginatedResponse({
    required this.success,
    required this.data,
    required this.meta,
    this.timestamp,
  });
}
```

### Recommended auth flow in app

1. Call `POST /auth/login`.
2. Store cookie jar in app persistence if needed.
3. Call protected routes.
4. On `401`, try `POST /auth/refresh` once, then retry request.
5. If refresh fails, route user to login.

## OpenAPI spec

Machine-readable contract is in `docs/superadmin-api/openapi.yaml`.
