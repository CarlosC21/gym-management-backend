# Gym Engine
Gym Engine is a high-performance, production-ready gym management application designed for single-location fitness facilities. It provides a streamlined authority for gym owners to manage athletes, programming, and billing through a dedicated SaaS-style interface.

The project is built on a "No Magic" philosophy, prioritizing explicit business rules, structured data flow, and high-utility UI over complex abstractions or heavy third-party dependencies.

Core Architecture
The system is split into two specialized repositories to ensure separation of concerns and scalability:

Backend: NestJS, PostgreSQL, Prisma ORM (v6.2.1).

Frontend: Next.js 16 (App Router), Tailwind CSS, Lucide React.

Design Language: High-contrast, dark mode SaaS aesthetic optimized for gym-floor utility with high-tap targets.

Key Technical Features
1. The WOD Engine
A custom workout delivery system that handles dynamic programming.

Smart Hydration: Backend-driven form hydration for workout creation.

Preservation of Intent: Uses whitespace-pre-wrap rendering to maintain precise formatting for complex workout descriptions.

Time-Gated Access: Implements "8:00 PM Sneak Peek" logic. Tomorrow's workouts are programmatically locked behind a 403 ForbiddenException until 8:00 PM local time.

2. Native PWA Shell
The application is configured to behave as a standalone hardware utility.

Layout: Utilizes 100dvh for true mobile viewport height consistency.

Touch Optimization: Strict mobile viewport metadata (user-scalable: false) and CSS overscroll-behavior overrides to prevent browser "bounce."

Asset Pipeline: Integrated HTML5 Canvas image compression (96x96px) for lightning-fast avatar processing.

3. Attendance & Logic Protocols
The "Swap" Protocol: High-efficiency class management using Prisma upsert operations on compound unique keys [userId, wodId], ensuring the "Single-Slot" rule is never violated.

Real-Time Rosters: Member Home view allows for instant Join/Leave/Swap actions with real-time roster avatar updates.

Auth & Security: JWT-based authentication with Role-Based Access Control (RBAC) and a "First-Access" universal password reset gate for new athletes.

Technical Stack
Layer	Technology
Framework (FE)	Next.js 16, Tailwind CSS
Framework (BE)	NestJS
Database	PostgreSQL
ORM	Prisma v6.2.1
State/API	Axios, React Hooks
Mobile	PWA (Manifest.ts), HTML5 Canvas
Logic Registry (Verified Engineering Standards)
Anniversary Billing
The system calculates billing cycles based on the athlete's join date rather than calendar months, preventing pro-ration complexity and ensuring a steady cash flow for the facility owner.

Hard Deletion Protocols
To maintain database integrity and performance, the system utilizes explicit hard deletion for transient data (like attendance slots) while maintaining strict relational integrity for core athlete profiles.

Offline Integrity
The frontend is architected to handle spotty gym Wi-Fi by caching the WOD locally via service workers, ensuring the workout is always accessible during high-intensity training.

Development Roadmap
Phase 15 (In Progress): Athlete Billing Deep-Dive. Implementing manual payment toggles, anniversary date extensions, and individual athlete profile management for admins.

Phase 16: Advanced Service Worker Layer for full offline workout persistence.

Phase 17: Automated performance tracking and historical PR (Personal Record) data visualization.

Setup and Installation
Backend
Navigate to gym-backend.

Install dependencies: npm install.

Configure .env with DATABASE_URL and JWT_SECRET.

Run migrations: npx prisma migrate dev.

Start server: npm run start:dev.

Frontend
Navigate to gym-frontend.

Install dependencies: npm install.

Configure .env.local with NEXT_PUBLIC_API_URL.

Start development server: npm run dev.
