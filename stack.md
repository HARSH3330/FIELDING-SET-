# Fielding Set – Technology Stack

This document defines the exact technology stack and development standards
for the Fielding Set platform.

The AI must strictly follow this stack when generating code.

---

# Frontend

Framework:
Next.js (App Router)

Language:
TypeScript

Styling:
TailwindCSS

Component Library:
ShadCN UI

State Management:
React Query (TanStack Query)

Image Handling:
Next.js Image component

Icons:
Lucide React

Form Handling:
React Hook Form + Zod validation

Routing:
Next.js built-in routing

---

# Backend

Framework:
Node.js with Express

Language:
TypeScript

Architecture:
MVC Pattern

Layers:
- Routes
- Controllers
- Services
- Database layer

Authentication:
JWT authentication

Password Hashing:
bcrypt

API Design:
RESTful APIs

Validation:
Zod

File Uploads:
Multer

---

# Database

Primary Database:
PostgreSQL

ORM:
Prisma ORM

Connection Pooling:
PgBouncer

Tables:
- users
- posts
- comments
- reactions
- flags

---

# Image Storage

Image hosting:

Cloud storage such as:
AWS S3 or Cloudinary

Images should be:

- optimized
- compressed
- served via CDN

---

# Caching

Caching Layer:
Redis

Used for:

- feed caching
- trending posts
- session storage
- rate limiting

---

# Search

Search engine:

PostgreSQL full-text search

Future upgrade:

Elasticsearch if traffic grows

---

# Infrastructure

Deployment Platform:

Frontend:
Vercel

Backend:
Render / AWS / Fly.io

Database Hosting:
Supabase or AWS RDS

Image CDN:
Cloudflare CDN

---

# Performance

The platform must support:

- large image feeds
- thousands of concurrent users
- infinite scroll feeds

Performance strategies:

- image lazy loading
- feed pagination
- CDN caching
- Redis caching

---

# Security

Security measures required:

- rate limiting
- JWT authentication
- input validation
- SQL injection prevention
- XSS protection
- CSRF protection

---

# Moderation

Moderation tools required:

- flagging system
- admin dashboard
- post removal
- user banning

---

# Code Quality

Code must follow:

- modular architecture
- reusable components
- clean folder structure
- environment variables for secrets
- ESLint rules