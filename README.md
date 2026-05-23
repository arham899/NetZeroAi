# NetZero AI - Carbon Footprint Calculator

A full-stack web application for calculating, tracking, and reducing personal and organizational carbon footprints. Built with React, TypeScript, Three.js, and Node.js/Express, the platform features an interactive 3D Earth visualization, a multi-step emissions calculator, real-time global CO2 data, AI-powered tree planting recommendations, and a comprehensive sustainability dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [License](#license)

---

## Overview

NetZero AI is a sustainability-focused platform that helps individuals, families, businesses, and corporations measure their carbon emissions across multiple categories including transportation, energy consumption, water and waste, and industrial activity. The application provides instant calculations, benchmark comparisons against global and national averages, personalized offset recommendations using AI, and historical trend tracking through an analytics dashboard.

The landing page uses a scrollytelling design pattern with a 3D rotating Earth rendered via Three.js and React Three Fiber. As the user scrolls, the Earth glides to the left while content sections reveal themselves, creating a cinematic storytelling experience. GSAP ScrollTrigger handles all scroll-based animations with scrubbed, physics-based transitions.

---

## Screenshots

### Landing Page - Hero Section
The hero section displays an interactive 3D Earth rendered with React Three Fiber and a dynamically rotating text element that cycles through the word "Impact" in multiple languages. The navigation bar provides access to all major sections of the application.

![Hero Section](screenshots/01-hero-section.png)

---

### Quick Calculator
A streamlined calculator panel that appears as the user scrolls past the hero. It accepts basic inputs for transportation (miles driven, flights per year), energy usage (electricity in kWh, natural gas in therms), and household size, then computes an instant carbon footprint estimate.

![Quick Calculator](screenshots/02-quick-calculator.png)

---

### Features Section
Highlights the platform's core capabilities: precision analytics with advanced measurement algorithms, personalized goal setting, instant calculation results, community engagement features, adherence to global emissions standards, and verified carbon offset project discovery.

![Features Section](screenshots/03-features-section.png)

---

### Global CO2 Emissions Data
A live data slideshow that presents country-level emissions statistics sourced from EDGAR/IEA 2024 reports. The carousel auto-rotates through major emitting nations (China, United States, India, EU, Russia), displaying each country's annual emissions in gigatonnes and its percentage share of global output.

![Climate Data Section](screenshots/04-climate-data.png)

---

### Call to Action
The closing section of the landing page encourages users to begin their journey towards carbon neutrality with a clear call-to-action button and motivational messaging.

![CTA Section](screenshots/05-cta-section.png)

---

### Login Page
A clean authentication form with email and password fields, password visibility toggle, forgot password link, and redirect to the sign-up page for new users.

![Login Page](screenshots/06-login-page.png)

---

### Sign Up Page
The registration form collects a full name, email address, and password. Account creation triggers a JWT-based authentication flow with encrypted password storage via bcrypt.

![Sign Up Page](screenshots/07-signup-page.png)

---

### Full Calculator - Multi-Step Wizard
A comprehensive 9-step emissions calculator wizard that walks users through detailed data entry. Steps include entity type selection (Individual, Family, Business, Company), geographic location, electricity usage, fuel consumption, transportation details (vehicle type, public transit, flights), water and waste metrics, industrial activity, carbon offsets, and a final review before submission.

![Calculator Wizard](screenshots/08-calculator-wizard.png)

---

## Features

### Frontend
- **Interactive 3D Earth** - Rendered with React Three Fiber and Three.js, the Earth responds to scroll position via GSAP ScrollTrigger, rotating and translating across the viewport as the user progresses through the landing page.
- **Scrollytelling Home Page** - A scroll-driven narrative experience using GSAP ScrollTrigger with scrubbed animations. Content sections fade in and out as the Earth moves, creating a cinematic flow.
- **Quick Calculator** - An at-a-glance emissions estimator embedded directly in the landing page for immediate engagement without requiring full form completion.
- **Full Multi-Step Calculator** - A 9-step wizard covering entity type, location, electricity, fuel, transport, water/waste, industry, offsets, and a review step. Each step includes validation and contextual help.
- **Sustainability Dashboard** - A data-rich analytics view with pie charts (category breakdown), bar charts (benchmark comparisons against global, US, and target averages), line charts (historical emissions trends), calculation history with CSV export, and actionable insight cards.
- **Results Page** - Detailed breakdown of calculation results with category-level emissions, AI-powered tree planting recommendations via Gemini/Groq integration, and data visualization.
- **Climate Data Slideshow** - Auto-rotating carousel displaying real-time CO2 emissions data by country from EDGAR GHG 2025 and IEA Global Energy Review sources.
- **Dynamic Impact Text** - A rotating text component that cycles through the word "Impact" in multiple languages (English, Spanish, French, German, Hindi, Chinese, Arabic, Japanese, Korean, Russian, Greek, Portuguese).
- **Intro Animation** - A cinematic loading sequence shown on first visit or page refresh, featuring the NetZero AI logo with animated effects.
- **Authentication** - Full auth flow with login, signup, forgot password (with email verification codes), protected routes, and JWT-based session management.
- **Responsive Design** - Fully responsive layouts using Tailwind CSS with mobile-first breakpoints.
- **Smooth Animations** - Framer Motion (via `motion/react`) for component-level animations, hover effects, and page transitions.

### Backend
- **RESTful API** - Express.js server with structured route handlers for calculations, authentication, tree recommendations, and tree species data.
- **MongoDB Integration** - Mongoose-based data models for Users and Calculations with full CRUD operations.
- **JWT Authentication** - Secure token-based auth with bcrypt password hashing, token refresh, and email-based password recovery.
- **AI-Powered Recommendations** - Integration with Google Gemini and Groq LLMs for generating personalized tree planting recommendations based on user location and emissions data.
- **Tree Species Database** - Curated dataset of tree species with CO2 absorption rates, regional suitability, and planting guidance.
- **Security Hardening** - Helmet.js for HTTP headers, CORS with origin whitelisting, rate limiting (100 req/15min global, stricter for auth), request body size limits, and response compression.
- **Email Service** - Nodemailer integration for sending verification codes during password recovery.
- **Input Validation** - Express Validator middleware for sanitizing and validating all incoming request data.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| Three.js / React Three Fiber | 3D Earth rendering |
| GSAP + ScrollTrigger | Scroll-driven animations |
| Framer Motion | Component animations |
| React Router DOM 7 | Client-side routing |
| Recharts | Dashboard charts (pie, bar, line) |
| Radix UI | Accessible UI primitives |
| Lucide React | Icon library |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB / Mongoose 9 | Database and ODM |
| JSON Web Tokens | Authentication |
| bcrypt.js | Password hashing |
| Google Generative AI SDK | AI tree recommendations |
| Groq SDK | Alternative AI provider |
| Nodemailer | Email delivery |
| Helmet | Security headers |
| Morgan | Request logging |
| express-rate-limit | Rate limiting |

---

## Project Structure

```
creative-carbon-calculator/
├── public/
│   └── netzero-logo.png
├── src/
│   ├── main.tsx                        # Application entry point
│   ├── assets/                         # Static assets
│   ├── styles/
│   │   ├── index.css                   # Global styles entry
│   │   ├── tailwind.css                # Tailwind configuration
│   │   ├── theme.css                   # Custom theme variables
│   │   └── fonts.css                   # Font imports
│   └── app/
│       ├── App.tsx                     # Root component with intro animation logic
│       ├── Router.tsx                  # Route definitions
│       ├── components/
│       │   ├── 3d/                     # Three.js Earth components
│       │   │   ├── Earth.tsx
│       │   │   ├── EarthScene.tsx
│       │   │   ├── EarthSceneCanvas.tsx
│       │   │   ├── HyperrealisticEarth.tsx
│       │   │   ├── Scene.tsx
│       │   │   └── StarField.tsx
│       │   ├── auth/                   # Auth guards
│       │   │   └── ProtectedRoute.tsx
│       │   ├── calculator/             # Calculator wizard
│       │   │   ├── CalculatorWizard.tsx
│       │   │   ├── StepSelector.tsx
│       │   │   └── steps/
│       │   │       ├── EntityTypeStep.tsx
│       │   │       ├── LocationStep.tsx
│       │   │       ├── ElectricityStep.tsx
│       │   │       ├── FuelStep.tsx
│       │   │       ├── TransportStep.tsx
│       │   │       ├── WaterWasteStep.tsx
│       │   │       ├── IndustryStep.tsx
│       │   │       ├── OffsetsStep.tsx
│       │   │       └── ReviewStep.tsx
│       │   ├── common/                 # Shared components
│       │   ├── results/                # Results display
│       │   │   └── TreeRecommendations.tsx
│       │   ├── sections/               # Landing page sections
│       │   │   ├── Hero.tsx
│       │   │   ├── HeroCarousel.tsx
│       │   │   ├── Features.tsx
│       │   │   ├── HowItWorks.tsx
│       │   │   ├── ImpactSection.tsx
│       │   │   └── CTASection.tsx
│       │   └── ui/                     # Reusable UI primitives (50+ components)
│       ├── hooks/                      # Custom React hooks
│       ├── layouts/
│       │   ├── MainLayout.tsx
│       │   ├── Navigation.tsx
│       │   └── Footer.tsx
│       ├── pages/
│       │   ├── ScrollytellingHome.tsx  # Main landing page
│       │   ├── Calculator.tsx
│       │   ├── Results.tsx
│       │   ├── Dashboard.tsx
│       │   ├── LoginPage.tsx
│       │   ├── SignupPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── About.tsx
│       │   ├── Landing.tsx
│       │   └── NotFound.tsx
│       ├── providers/                  # Context providers
│       ├── services/
│       │   ├── apiService.ts           # HTTP client layer
│       │   └── climateNewsService.ts   # Climate data fetching
│       ├── store/
│       │   ├── AuthContext.tsx          # Auth state management
│       │   ├── CalculatorProvider.tsx   # Calculator data provider
│       │   └── calculatorStore.ts      # Calculator state store
│       ├── types/                      # TypeScript type definitions
│       └── utils/                      # Utility functions
├── server/
│   ├── index.js                        # Express server entry
│   ├── package.json
│   ├── .env.example                    # Environment template
│   ├── db/
│   │   ├── database.js                 # MongoDB connection
│   │   ├── migrate.js                  # Database migrations
│   │   ├── storage.js                  # Data persistence layer
│   │   ├── data/                       # Seed data
│   │   └── models/
│   │       ├── User.js                 # User schema
│   │       └── Calculation.js          # Calculation schema
│   ├── middleware/
│   │   ├── auth.js                     # JWT verification
│   │   └── validate.js                 # Input validation rules
│   ├── routes/
│   │   ├── auth.js                     # Auth endpoints
│   │   ├── calculations.js             # Calculation CRUD
│   │   ├── treeRecommendations.js      # AI recommendations
│   │   └── treeSpecies.js              # Tree species data
│   └── services/
│       └── emailService.js             # Nodemailer setup
├── screenshots/                        # Application screenshots
├── package.json
├── vite.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arham899/NetZeroAi.git
   cd NetZeroAi
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your MongoDB URI, JWT secret, and other configuration values (see [Environment Variables](#environment-variables)).

5. Start the development server (runs both frontend and backend concurrently):
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to the local development port displayed in the terminal output.

---

## Environment Variables

Create a `server/.env` file based on `server/.env.example`:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/carbon-calculator?retryWrites=true&w=majority

# JWT secret key for token signing
JWT_SECRET=your_secure_jwt_secret_key_here

# Server port (default: 5000)
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=your_frontend_url

# Google Gemini API key (for AI tree recommendations)
GEMINI_API_KEY=your_gemini_api_key

# Groq API key (alternative AI provider)
GROQ_API_KEY=your_groq_api_key

# Email service credentials (for password recovery)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and receive JWT |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/forgot-password` | Request password reset code |
| POST | `/api/auth/verify-code` | Verify email reset code |
| POST | `/api/auth/reset-password` | Set new password with valid code |

### Calculations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/calculate` | Submit emissions data and get results |
| GET | `/api/calculations` | Get user's calculation history |

### Tree Recommendations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tree-recommendations` | Get AI-powered tree planting suggestions |

### Tree Species
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tree-species` | Get tree species with CO2 absorption data |

---

## Architecture

The application follows a client-server architecture with clear separation of concerns:

- **Frontend**: A single-page application built with React and React Router DOM. State is managed through React Context providers (AuthContext for authentication, CalculatorProvider for form data and history). The 3D rendering pipeline uses React Three Fiber as a declarative wrapper over Three.js, with GSAP ScrollTrigger controlling camera positions and Earth transforms based on scroll progress.

- **Backend**: An Express.js REST API with middleware layers for security (Helmet, CORS, rate limiting), authentication (JWT), and validation (express-validator). The server connects to MongoDB Atlas for persistent storage and integrates with external AI services (Google Gemini, Groq) for generating tree planting recommendations.

- **Data Flow**: User inputs from the multi-step calculator are aggregated client-side using the emissions aggregator utility, which applies EPA-standard emission factors to compute CO2-equivalent values across all categories. Results can be saved to the backend for historical tracking, and the dashboard fetches this history for trend visualization.

---

## License

This project is licensed under the ISC License.