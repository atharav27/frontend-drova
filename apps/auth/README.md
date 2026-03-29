# Drova Auth App

A dedicated authentication frontend application for the Drova logistics platform.

## Overview

This app provides centralized authentication pages (login, signup, password reset) that redirect users to the appropriate Drova app based on their role:

- **Drivers** → Redirected to Driver Jobs App (port 3004)
- **Buyers/Sellers** → Redirected to Marketplace App (port 3002)

## Features

- 📱 **Phone-based Authentication** - OTP verification via SMS
- 🔐 **Role-based Redirects** - Automatic routing to correct app
- 🎨 **Consistent UI** - Shared components from @repo/ui
- 🔄 **Cross-app Token Sharing** - Seamless authentication across apps
- 📊 **Form Validation** - Zod schemas with React Hook Form
- 🎭 **Smooth Animations** - Framer Motion transitions

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DRIVERJOBS_URL=http://localhost:3004
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:3002
```

## Architecture

```text
apps/auth/
├── app/
│   ├── login/page.tsx          # Login flow
│   ├── signup/page.tsx         # Registration flow
│   ├── forgot-password/        # Password reset
│   ├── reset-password/         # Password reset confirmation
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Auth home page
│   └── globals.css             # Global styles
├── components/                 # Auth-specific components
├── hooks/                      # Auth-specific hooks
└── types/                      # TypeScript definitions
```

## Integration

This app integrates with:

- **Backend API** - Your deployed authentication service
- **Driver Jobs App** - Receives driver users
- **Marketplace App** - Receives buyer/seller users
- **Shared Packages** - @repo/ui, @repo/lib, @repo/hooks, @repo/schemas

## Deployment

The auth app runs on port 3003 and should be deployed as a separate service alongside your other apps.

## Cross-App Flow

1. User visits auth app (port 3003)
2. Completes registration/login
3. Gets redirected to appropriate app with tokens
4. Target app stores tokens and user is authenticated

## URL Structure

- `/` - Auth home page
- `/login` - Phone + OTP login
- `/signup` - Multi-step registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset confirmation
