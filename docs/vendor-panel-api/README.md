# Vendor Panel API Documentation (Flutter)

This document describes the current API surface for `apps/vendor-panel` and the present runtime behavior.

## Current backend status

All current route handlers in `apps/vendor-panel/app/api/**/route.ts` are placeholder handlers.

For every listed route:
- `GET` returns:

```json
{ "message": "TODO: GET handler" }
```

- `POST` returns:

```json
{ "message": "TODO: POST handler" }
```

There is no finalized auth/validation/error contract yet in vendor-panel routes.

## Base URL

- Production: `https://<your-vendor-panel-domain>`
- Local: `http://localhost:3000`

Current endpoints are under `/api/*`.

## Endpoint groups

### Auth
- `GET /api/auth/login`
- `POST /api/auth/login`
- `GET /api/auth/register`
- `POST /api/auth/register`
- `GET /api/auth/logout`
- `POST /api/auth/logout`

### Analytics
- `GET /api/analytics`
- `POST /api/analytics`

### Customers
- `GET /api/customers`
- `POST /api/customers`

### Orders
- `GET /api/orders`
- `POST /api/orders`

### Products
- `GET /api/products`
- `POST /api/products`

### Store
- `GET /api/store`
- `POST /api/store`
- `GET /api/store/setup`
- `POST /api/store/setup`
- `GET /api/store/branding`
- `POST /api/store/branding`
- `GET /api/store/theme`
- `POST /api/store/theme`

### Payments
- `GET /api/payments/create`
- `POST /api/payments/create`
- `GET /api/payments/verify`
- `POST /api/payments/verify`
- `GET /api/payments/webhook`
- `POST /api/payments/webhook`

### Email
- `GET /api/email/welcome`
- `POST /api/email/welcome`
- `GET /api/email/order-confirmed`
- `POST /api/email/order-confirmed`
- `GET /api/email/order-received`
- `POST /api/email/order-received`
- `GET /api/email/payout-processed`
- `POST /api/email/payout-processed`

## Current response schema

```json
{
  "message": "TODO: GET handler"
}
```

```json
{
  "message": "TODO: POST handler"
}
```

## OpenAPI spec

Machine-readable contract is available at:
- `docs/vendor-panel-api/openapi.yaml`

## UI parity work completed (Superadmin -> Vendor Panel)

The following MNC-style frontend parity is now implemented in vendor-panel:

- Shared visual direction and tokens:
  - `apps/vendor-panel/app/globals.css`
  - `apps/vendor-panel/app/layout.tsx`
- Shared primitives:
  - `apps/vendor-panel/components/ui/button.tsx`
  - `apps/vendor-panel/components/ui/card.tsx`
- Sidebar/shell/nav parity:
  - `apps/vendor-panel/components/layout/dashboard-shell.tsx`
  - `apps/vendor-panel/components/layout/sidebar.tsx`
  - `apps/vendor-panel/components/layout/navbar.tsx`
  - `apps/vendor-panel/components/layout/mobile-nav.tsx`
  - `apps/vendor-panel/components/layout/page-header.tsx`
  - `apps/vendor-panel/constants/routes.ts`
- Requested pages implemented with proper UI:
  - `apps/vendor-panel/app/(dashboard)/dashboard/page.tsx`
  - `apps/vendor-panel/app/(dashboard)/inventory/page.tsx`
  - `apps/vendor-panel/app/(dashboard)/orders/page.tsx`
  - `apps/vendor-panel/app/(dashboard)/invoice/page.tsx`
  - `apps/vendor-panel/app/(dashboard)/store/settings/page.tsx`
  - `apps/vendor-panel/app/(dashboard)/store/branding/page.tsx`
- Compatibility route:
  - `apps/vendor-panel/app/(dashboard)/products/page.tsx` redirects to `/inventory`

## Next API hardening phase (recommended)

To match the superadmin API maturity, implement these next in vendor-panel APIs:

1. Add standardized envelopes:
- success: `{ success, data, timestamp }`
- error: `{ success:false, error, details, timestamp }`
- paginated: `{ success, data, meta, timestamp }`

2. Add auth middleware for protected vendor routes.

3. Add request validation via Zod.

4. Add `/api/v1/*` aliases and migrate frontend clients to v1.

5. Add endpoint-level rate limiting for auth and sensitive mutations.
