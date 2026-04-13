# The Obsidian Curator — E-Commerce Application

A premium, secure e-commerce platform built with React, TypeScript, and Vite. Specializes in curated luxury goods with advanced checkout flows, order tracking, and administrative controls.

## 🎯 Project Overview

**The Obsidian Curator** is a full-featured e-commerce SPA featuring:
- **User Authentication** — Login, registration, password recovery
- **Product Catalog** — Shop, categories (timepieces, jewelry, leather goods), search
- **Shopping Cart** — Add/remove items, real-time updates
- **Checkout Flow** — Multi-step process (address → payment → review → confirmation)
- **Order Tracking** — Real-time shipment status and history
- **User Profiles** — Saved addresses, payment methods, notifications, security settings
- **Admin Dashboard** — Product and customer management
- **AI Integration** — Powered by Google Gemini API

## 📋 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| TypeScript | 5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool & dev server |
| Tailwind CSS | 4.1.14 | Styling |
| Lucide React | 0.546.0 | Icon library |
| Motion | 12.23.24 | Animations |
| Express | 4.21.2 | Backend (optional) |
| Gemini AI | 1.29.0 | AI features |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Add your Supabase anon API key for newsletter signup:
      ```env
      VITE_SUPABASE_API_KEY=your_supabase_anon_key_here
      ```
     `VITE_SUPABASE_URL` is optional. If left empty, the app derives project URL from the key.

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run clean        # Remove dist directory
npm run lint         # Check TypeScript without emitting
```

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component (routes, state management)
├── main.tsx             # React entry point
└── index.css            # Global styles

scripts/                 # Utility & migration scripts
├── remove_avatars.ts    # Avatar removal transformations
├── fix_navbars.ts       # Navigation standardization
└── ...                  # Other refactoring utilities

app/                     # Additional applets
├── applet/
│   ├── remove_links.ts  # Link removal transformations
│   └── ...

Configuration Files:
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.*    # Tailwind CSS settings (if present)
├── package.json         # Dependencies & scripts
└── index.html           # HTML entry point
```

## 🎨 Features by View

### Public Views
- **Login / Register** — User authentication
- **Forgot Password** — Password reset flow
- **Home** — Landing page with featured products
- **Shop** — Product catalog with filtering
- **Categories** — Timepieces, Jewelry, Leather goods
- **Product Detail** — Full product information with add-to-cart
- **Cart** — Review items before checkout

### Checkout Flow (3-step)
- **Address** — Shipping & billing information
- **Payment** — Payment method selection
- **Review** — Order summary & confirmation
- **Success** — Order confirmation & tracking number

### User Features
- **Order Tracking** — Real-time shipment status
- **My Orders** — Order history and details
- **Profile** — User account management
  - Saved Addresses
  - Saved Payment Methods
  - Notifications Settings
  - Security & Password
  - Help & Support
- **Wishlist** — Saved favorite items

### Admin Dashboard
- **Products** — Inventory management
- **Customers** — User management
- **Analytics** — Sales & traffic metrics

## 🎯 View Types (TypeScript)

The app uses a Union type to manage navigation:
```typescript
type View = 'login' | 'register' | 'forgot-password' | 'home' | 'shop' | 
  'product-detail' | 'cart' | 'checkout-address' | 'checkout-payment' | 
  'checkout-review' | 'checkout-success' | 'order-tracking' | 'my-orders' | 
  'profile' | 'wishlist' | 'admin' | 'admin-products' | 'admin-customers' | ...
```

## 🔧 Configuration

### Newsletter (Supabase)

Footer newsletter forms now post to Supabase REST at:

`/rest/v1/newsletter_subscribers`

Create the table in Supabase SQL editor:

```sql
create table if not exists public.newsletter_subscribers (
  id bigserial primary key,
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_idx
on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

create policy "Allow public insert newsletter"
on public.newsletter_subscribers
for insert
to anon
with check (
  email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and source in ('website-footer')
);
```

### Vite Configuration
- **Port:** 3000 (configurable via CLI)
- **Host:** 0.0.0.0 (accessible from network)
- **Plugins:** React, Tailwind CSS v4
- **Path Alias:** `@/*` maps to project root

### TypeScript
- **Target:** ES2022
- **Module:** ESNext
- **JSX:** React JSX (automatic runtime)
- **Strict Mode:** Enabled

### Tailwind CSS
- Using `@tailwindcss/vite` for optimized builds
- Custom color palette (Material Design 3 tokens)
- Dark mode support

## 🚨 Important Notes

### Development Server
- HMR can be disabled via `DISABLE_HMR` environment variable
- File watching disabled during agent-based edits to prevent flickering

### Google Fonts
- Fonts are loaded via `<link>` tags in `index.html` to avoid PostCSS import warnings
- Includes: Fraunces, Manrope, JetBrains Mono, Material Symbols

### Utility Scripts
Migration and transformation scripts are stored in `scripts/` directory. These were used to refactor UI components during development. See [scripts/README.md](scripts/README.md) for details.

## 🔐 Security

- Environment variables stored in `.env.local` (never commit)
- API keys handled via Vite's `define` config
- Password fields use appropriate input types and validation
- Secure checkout with validation at each step

## 📚 Development Notes

- Component state managed via React hooks (useState, useEffect)
- Animations via Motion library for smooth transitions
- Responsive design (mobile-first) with Tailwind breakpoints
- Lucide icons for consistent UI
- TypeScript strict mode for type safety

## 🤝 Contributing

1. Create a feature branch from `main`
2. Follow TypeScript strict mode conventions
3. Ensure `npm run lint` passes before committing
4. Test responsive design on mobile/tablet
5. Submit PR with clear description of changes

## 📝 License

Project metadata available in `metadata.json`

---

**Last Updated:** April 2026  
**Status:** Active Development
