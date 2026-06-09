# Library Management System - Hackathon Sprint Plan

**Project:** Library Management System (MERN Stack)  
**Date:** June 9–10, 2026  
**Duration:** 2-Day Hackathon → **Final 3-Hour Crunch Sprint**  
**Team Size:** 5 Developers  
**Tech Stack:** MongoDB, Express.js, React (Vite + TypeScript), Node.js, Tailwind CSS, JWT + bcryptjs, i18next (Arabic/English RTL)  
**Status:** Backend foundation + models ready | Clerk removed | JWT implemented | 3-hour deadline to MVP + full deliverables

## 1. Team Roles & Responsibilities

| Role | Member | Key Responsibilities |
|------|--------|----------------------|
| **Backend Lead** | P1 | API routes, models, seed data, database logic |
| **Auth & Security** | P2 | JWT, RBAC, .env, security audit, seed users |
| **Frontend UI** | P3 | Tailwind styling, layouts, components, responsiveness |
| **Frontend Logic + i18n** | P4 | API integration, routing, state, **i18n (critical)** |
| **Docs + QA** | P5 | All 10 deliverables, testing, screenshots, README |

## 2. Constraints & Priorities
- **Only 3 hours** remaining until submission
- Working **MVP demo** mandatory
- All 10 deliverables required
- Arabic/English toggle **critical** (RTL support)
- No GitHub copy-paste
- Focus: **Demo flows** > Polish

**Must-Have Demo Flows:**
1. Guest → Catalog browsing
2. Librarian → Borrow + Return (with fine calculation)
3. Admin/Librarian → Dashboard stats
4. Language toggle (EN ↔ AR) with full RTL flip

## 3. Detailed 3-Hour Sprint Breakdown

### **T+0:00 – T+0:15** | Emergency Setup & Fixes (15 min)
**Goal:** Stabilize foundation

- **All:** Quick sync + Atlas index drop (`clerkId_1`)
- **P2:** Fix `.env` (JWT_SECRET, MONGODB_URI, CLIENT_URL), run `./test-auth.sh`
- **P3 & P4:** Install Tailwind + i18next packages
- **P1:** Verify models & existing middleware
- **P5:** Create submission folder + start documents

**DoD:** Auth test passes, packages installed, i18n ready to init

### **T+0:15 – T+0:50** | Sprint 0: Core Foundation + i18n (35 min)
**Goal:** i18n + Tailwind + routing skeleton

**P4 (Priority Owner):**
- Initialize i18next + react-i18next + language detector
- Create `en.json` & `ar.json` (30+ keys)
- Language toggle + `document.documentElement.dir` + `lang`
- Wrap app with I18nextProvider

**P3:**
- Tailwind config + `MainLayout.tsx` (navbar with role-based links)

**P1 + P2:**
- Create missing route files (`books.js`, `loans.js`, `dashboard.js`, `members.js`)
- Mount in `routes/index.js`
- Run `node seed.js`

**P5:** Start Vision Document + Sprint Plan (this file)

### **T+0:50 – T+1:40** | Sprint 1: Core APIs + UI Screens (50 min)
**Goal:** Functional backend + connected frontend pages

**P1:** Implement full CRUD for Books, Members, Loans (borrow/return + fine logic)

**P3:** Build pages:
- `LoginPage.tsx`
- `CatalogPage.tsx` (public grid)
- `DashboardPage.tsx` (stats cards)
- `BooksPage.tsx` (table + form)
- `LoansPage.tsx` (borrow/return)

**P4:** 
- Wire all pages to `api.ts`
- Protected routes per role
- Complete routing in `App.tsx`

**P2:** Final RBAC + seed demo accounts

**P5:** 
- Generate ERD (dbdiagram.io)
- Start wireframes (Uizard or Figma)

### **T+1:40 – T+2:20** | Sprint 2: Integration + Arabic Support (40 min)
**Goal:** End-to-end flows + RTL

- **P3 + P4:** Full i18n coverage, RTL testing & fixes, toasts, responsive
- **P1:** Bug fixes from integration
- **P2:** Security audit + demo credentials
- **P5:** API docs (Postman export), Use Case Diagram

### **T+2:20 – T+2:50** | Sprint 3: Polish + Documentation (30 min)
**Goal:** Submission-ready

- **All:** Bug bash on demo flows
- **P5 leads:** Complete all 10 deliverables:
  - Vision Document
  - Requirements Specification
  - User Stories (formatted)
  - Use Case Diagram
  - ERD
  - API Documentation
  - Wireframes
  - **This Sprint Plan**
  - Working MVP (GitHub)
  - AI Tools Reference

### **T+2:50 – T+3:00** | Final Submission & Demo Rehearsal (10 min)
- Push to GitHub
- Prepare 4-minute demo script
- Submit Google Sheet + repo link

## 4. Risk Register & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|----------|
| i18n/RTL breaks layout | High | High | P4 owns from minute 15, test early |
| Auth/JWT issues | Medium | High | P2 owns, test-auth.sh |
| Time overrun on features | High | High | Prioritize demo flows only |
| Missing deliverables | Medium | High | P5 works in parallel from start |
| Seed/DB issues | Medium | Medium | One-click seed script |

## 5. AI Tools Used
- Claude (planning, code generation, debugging)
- Uizard / Figma (wireframes)
- dbdiagram.io (ERD)
- ChatGPT (docs formatting)

## 6. Demo Script (4 minutes)
1. Guest → Catalog search + book cards
2. Login as Librarian → Borrow book → Return (show fine)
3. Login as Admin → Dashboard stats
4. Toggle Arabic → Show RTL flip across app

---

**This file is ready for submission.**  
You can copy it directly or I can refine any section further.

Would you like me to also generate:
- The **Vision Document**?
- **ERD description / DBML**?
- **API Documentation table**?

Just say the word. Let's get this submitted! 🚀
