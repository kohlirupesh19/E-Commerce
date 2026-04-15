# 🖤 The Obsidian Curator — E-Commerce Platform

A premium, full-stack e-commerce platform for curated luxury goods. Built with a **React + TypeScript** frontend and a **Spring Boot (Java)** backend featuring JWT authentication, Razorpay payments, Cloudinary media uploads, and comprehensive REST APIs.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Configuration Reference](#-configuration-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

**The Obsidian Curator** is a full-featured e-commerce application specializing in luxury goods — timepieces, jewelry, and leather goods. It follows a decoupled architecture with a React SPA consuming REST APIs served by a Spring Boot backend.

### Key Highlights

- 🔐 **JWT Authentication** — Secure login, registration with OTP verification, password reset
- 🛒 **Full Shopping Experience** — Product catalog, cart, wishlist, multi-step checkout
- 💳 **Razorpay Payments** — Integrated payment gateway with webhook support
- 📦 **Order Management** — Order placement, tracking, and history
- 🖼️ **Cloudinary Integration** — Image upload and media management
- 📧 **Email Notifications** — OTP delivery, order confirmations via Gmail SMTP
- 🛡️ **Admin Dashboard** — Product CRUD, category management, customer overview
- 🤖 **AI Assistant** — Powered by Google Gemini API
- 📄 **Swagger API Docs** — Auto-generated OpenAPI documentation

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version  | Purpose                    |
|------------------|----------|----------------------------|
| React            | 19.0.0   | UI framework               |
| TypeScript       | 5.8.2    | Type safety                |
| Vite             | 6.2.0    | Build tool & dev server    |
| Tailwind CSS     | 4.1.14   | Utility-first styling      |
| Lucide React     | 0.546.0  | Icon library               |
| Motion           | 12.23.24 | Animations                 |
| Gemini AI        | 1.29.0   | AI-powered features        |

### Backend

| Technology         | Version  | Purpose                     |
|--------------------|----------|-----------------------------|
| Java               | 21+      | Language runtime            |
| Spring Boot        | 3.3.4    | Application framework       |
| Spring Security    | —        | Authentication & authorization |
| Spring Data JPA    | —        | ORM & database access       |
| H2 Database        | —        | In-memory DB (development)  |
| PostgreSQL         | 42.7.10  | Production database driver  |
| JJWT               | 0.12.6   | JWT token handling          |
| Razorpay Java      | 1.4.8    | Payment gateway             |
| Cloudinary         | 1.39.0   | Image/media uploads         |
| ModelMapper        | 3.2.1    | DTO ↔ Entity mapping        |
| iText 7            | 8.0.5    | PDF generation (invoices)   |
| Lombok             | 1.18.40  | Boilerplate reduction       |
| SpringDoc OpenAPI  | 2.6.0    | Swagger UI / API docs       |

---

## 📁 Project Structure

```
E-Commerce/
├── 📦 Frontend (Root)
│   ├── index.html               # HTML entry point
│   ├── package.json             # Frontend dependencies & scripts
│   ├── vite.config.ts           # Vite build configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── .env.example             # Environment variable template
│   └── src/
│       ├── App.tsx              # Main app component (routes, state)
│       ├── main.tsx             # React entry point
│       ├── index.css            # Global styles
│       ├── components/          # Reusable UI components
│       ├── contexts/            # React context providers
│       ├── services/            # API client services
│       ├── views/               # Page-level view components
│       └── lib/                 # Utility libraries
│
├── ☕ Backend (backend/)
│   ├── pom.xml                  # Maven project configuration
│   └── src/main/
│       ├── java/com/obsidian/curator/
│       │   ├── ObsidianCuratorApplication.java   # Spring Boot entry point
│       │   ├── config/          # Security, CORS, app configs
│       │   ├── controller/      # REST API controllers
│       │   │   ├── AuthController.java
│       │   │   ├── ProductController.java
│       │   │   ├── CartController.java
│       │   │   ├── OrderController.java
│       │   │   ├── WishlistController.java
│       │   │   ├── AddressController.java
│       │   │   ├── PaymentMethodController.java
│       │   │   ├── CategoryController.java
│       │   │   ├── NotificationController.java
│       │   │   ├── NewsletterController.java
│       │   │   ├── SearchController.java
│       │   │   └── AdminCatalogController.java
│       │   ├── service/         # Business logic interfaces
│       │   │   └── impl/        # Service implementations
│       │   ├── repository/      # Spring Data JPA repositories
│       │   ├── entity/          # JPA entity models
│       │   │   └── enums/       # Enum types (OrderStatus, Role, etc.)
│       │   ├── dto/
│       │   │   ├── request/     # Incoming request DTOs
│       │   │   └── response/    # Outgoing response DTOs
│       │   ├── security/        # JWT filter, utilities, UserDetailsService
│       │   ├── exception/       # Custom exceptions & global handler
│       │   └── util/            # Helpers (Email, OTP, Price)
│       └── resources/
│           ├── application.properties       # Main configuration
│           └── application-dev.properties   # Dev profile overrides
│
├── services/                    # Optional Node.js microservices
│   ├── api/                     # Express API scaffold
│   └── worker/                  # Background worker scaffold
│
├── scripts/                     # Utility & migration scripts
├── docs/                        # Documentation
├── public/                      # Static assets
└── tests/                       # Playwright E2E tests
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

| Tool       | Minimum Version | Download                                                    |
|------------|-----------------|-------------------------------------------------------------|
| **Node.js** | 16+ (LTS)      | [nodejs.org](https://nodejs.org/)                           |
| **npm**     | 8+             | Comes with Node.js                                          |
| **Java**    | 21+            | [adoptium.net](https://adoptium.net/) or `brew install openjdk` |
| **Maven**   | 3.8+           | [maven.apache.org](https://maven.apache.org/) or `brew install maven` |

> [!NOTE]
> The backend uses **H2 in-memory database** by default for local development, so PostgreSQL is **not required** to get started. For production, configure PostgreSQL in `application.properties`.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kohlirupesh19/E-Commerce.git
cd E-Commerce
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set the required keys:

```env
# Required — Gemini AI features
GEMINI_API_KEY=your_gemini_api_key

# Optional — Newsletter signup
VITE_SUPABASE_API_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=                              # auto-derived if empty
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Build the Backend (First Time)

```bash
cd backend
mvn clean install -DskipTests
cd ..
```

---

## ▶️ Running the Application

You need to start **both** the backend and frontend servers.

### Start the Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

The backend API will start at **`http://localhost:8080`**

> [!TIP]
> To run with the dev profile (verbose SQL logging):
> ```bash
> mvn spring-boot:run -Dspring-boot.run.profiles=dev
> ```

### Start the Frontend (Terminal 2)

```bash
npm run dev
```

The frontend will start at **`http://localhost:3000`**

### 🎉 You're All Set!

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

---

## 📜 All Available Commands

### Frontend Commands

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm install`        | Install all frontend dependencies        |
| `npm run dev`        | Start Vite dev server with hot reload    |
| `npm run build`      | Build production bundle to `dist/`       |
| `npm run preview`    | Preview the production build locally     |
| `npm run clean`      | Remove the `dist/` directory             |
| `npm run lint`       | Type-check with TypeScript (no emit)     |

### Backend Commands

| Command                                        | Description                              |
|------------------------------------------------|------------------------------------------|
| `mvn clean install`                            | Build project & run tests                |
| `mvn clean install -DskipTests`                | Build project, skip tests                |
| `mvn spring-boot:run`                          | Start Spring Boot server (port 8080)     |
| `mvn spring-boot:run -Dspring-boot.run.profiles=dev` | Start with dev profile (debug SQL)  |
| `mvn test`                                     | Run backend unit tests                   |
| `mvn clean`                                    | Clean compiled output (`target/`)        |

---

## 📡 API Documentation

Once the backend is running, Swagger UI is available at:

🔗 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Core API Endpoints

| Module             | Base Path               | Description                         |
|--------------------|-------------------------|-------------------------------------|
| **Authentication** | `/api/auth/*`           | Register, login, OTP, password reset |
| **Products**       | `/api/products/*`       | Browse catalog, product details     |
| **Cart**           | `/api/cart/*`           | Add/remove/update cart items        |
| **Orders**         | `/api/orders/*`         | Place orders, track status          |
| **Wishlist**       | `/api/wishlist/*`       | Toggle favorite products            |
| **Addresses**      | `/api/addresses/*`      | Manage shipping/billing addresses   |
| **Payment Methods**| `/api/payment-methods/*`| Saved payment methods               |
| **Categories**     | `/api/categories/*`     | Product category listing            |
| **Notifications**  | `/api/notifications/*`  | User notification management        |
| **Newsletter**     | `/api/newsletter/*`     | Email subscription                  |
| **Search**         | `/api/search/*`         | Product search                      |
| **Admin Catalog**  | `/api/admin/catalog/*`  | Admin: product & category CRUD      |

---

## 🎨 Features

### 🛍️ Customer Facing

- **User Authentication** — Register with OTP verification, login, forgot/reset password
- **Product Catalog** — Browse by category (Timepieces, Jewelry, Leather Goods), search, filter
- **Product Details** — Images, descriptions, variants, reviews
- **Shopping Cart** — Add/remove items, quantity management, real-time price updates
- **Wishlist** — Save and manage favorite products
- **Multi-Step Checkout** — Address → Payment → Review → Confirmation
- **Order Tracking** — Real-time shipment status and order history
- **User Profile** — Manage addresses, payment methods, notifications, security settings
- **AI Assistant** — Powered by Google Gemini for product recommendations

### 🔧 Admin Panel

- **Product Management** — Create, update, delete products with image uploads
- **Category Management** — Organize product categories
- **Customer Overview** — View registered users and activity

### 🔐 Security

- JWT-based stateless authentication (access + refresh tokens)
- Password hashing with BCrypt
- OTP-based email verification
- CORS configuration for frontend–backend communication
- Spring Security filter chain with role-based access control

---

## ⚙️ Configuration Reference

### Backend — `application.properties`

| Property                              | Default Value         | Description                  |
|---------------------------------------|-----------------------|------------------------------|
| `server.port`                         | `8080`                | Backend server port          |
| `spring.datasource.url`              | H2 in-memory          | Database connection URL      |
| `spring.jpa.hibernate.ddl-auto`      | `create-drop`         | Schema strategy              |
| `jwt.secret`                          | (configured)          | JWT signing secret           |
| `jwt.access-token-expiry`            | `900000` (15 min)     | Access token TTL (ms)        |
| `jwt.refresh-token-expiry`           | `604800000` (7 days)  | Refresh token TTL (ms)       |
| `spring.mail.host`                   | `smtp.gmail.com`      | SMTP server for emails       |
| `razorpay.key.id`                    | (configure)           | Razorpay API key             |
| `cloudinary.cloud-name`             | (configure)           | Cloudinary cloud name        |
| `frontend.url`                       | `http://localhost:5173`| Allowed frontend origin      |

### Frontend — `.env`

| Variable                  | Required | Description                          |
|---------------------------|----------|--------------------------------------|
| `GEMINI_API_KEY`          | Yes      | Google Gemini API key                |
| `VITE_SUPABASE_API_KEY`   | No       | Supabase anon key (newsletter)       |
| `VITE_SUPABASE_URL`       | No       | Supabase project URL (auto-derived)  |

### Vite Dev Server

| Setting   | Value       | Notes                             |
|-----------|-------------|-----------------------------------|
| Port      | `3000`      | Configurable via CLI              |
| Host      | `0.0.0.0`   | Accessible on local network       |
| HMR       | Enabled     | Disable via `DISABLE_HMR=true`    |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow** TypeScript strict mode and Java conventions
4. **Ensure** both `npm run lint` and `mvn test` pass
5. **Test** responsive design on mobile and tablet
6. **Submit** a PR with a clear description of changes

---

## 📝 License

Project metadata available in `metadata.json`

---

<p align="center">
  <b>The Obsidian Curator</b> — Curated luxury, engineered with precision.<br/>
  <sub>Built with React · Spring Boot · ❤️</sub>
</p>

**Last Updated:** April 2026
**Status:** Active Development
