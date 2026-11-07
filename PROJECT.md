# Project: Interactive Financing Calculator (Grupo AAA - Corales del Viento)

## Architecture
The Interactive Financing Calculator provides end-to-end parametric financing calculation for real estate projects:
1. **Database & Audit Layer**: PostgreSQL tables `projects` and `projects_aud` (Hibernate Envers) with 6 financial parameter columns, managed via Flyway migration V25.
2. **Backend Domain & API Layer**: Spring Boot 3 entity `Project`, DTO records (`CreateProjectRequest`, `UpdateProjectRequest`, `ProjectDetailResponse`, `ProjectSummaryResponse`), and `ProjectService` with Caffeine cache eviction (`@CacheEvict`) and REST endpoints under `/api/v1/admin/projects` and `/api/v1/public/projects`.
3. **Admin Management Layer**: Next.js App Router (`frontend/src/app/admin/projects/page.tsx`), providing an activation switch, inputs for all 5 parameters with defaults, and a real-time reactive simulation preview card inside the project modal.
4. **Public Sales & Master Plan Integration Layer**: Public view (`frontend/src/app/proyectos/[slug]/page.tsx`), integrated with `InteractiveMasterPlan.tsx` and a dedicated `FinancingCalculator.tsx` component. Implements the 3-step financing formula (Separation $1M -> 20% Initial minus Separation at 30 days -> 80% Balance over 12M 0% or 24M French amortization at 1% monthly) and dynamic WhatsApp CTA with GA4 tracking.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Database Migration V25 | Add 6 financial columns to `projects` and `projects_aud`, enable for Corales del Viento | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Domain Entity `Project` | Map 6 financial fields with `@Column` and `@Builder.Default` | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Backend DTOs & Backwards Compatibility | Update records `CreateProjectRequest`, `UpdateProjectRequest`, `ProjectDetailResponse`, `ProjectSummaryResponse` with overloaded constructors | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Service Mapping & Cache Eviction | Map financial fields in `ProjectService.toDetail` & `toSummary`; verify `@CacheEvict` flushes public caches | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Backend Unit Tests | Create `ProjectServiceTest` verifying creation, update, defaults, and cache evictions | M1 | ORIGINAL_REQUEST Acceptance Criteria |
| 6 | Admin API Integration | Update `ProjectRequest` and project types in `frontend/src/lib/api.ts` with 6 financial fields | M2 | ORIGINAL_REQUEST §R3 |
| 7 | Admin Projects Modal Form | Add financing section with toggle switch and 5 input fields in `frontend/src/app/admin/projects/page.tsx` | M2 | ORIGINAL_REQUEST §R3 |
| 8 | Admin Modal Live Preview Card | Implement reactive live calculation card in the admin modal matching the French amortization formula | M2 | ORIGINAL_REQUEST §R3 |
| 9 | Public Project Detail Fallback | Expose financial fields in `frontend/src/app/proyectos/[slug]/page.tsx` and Corales del Viento fallback | M3 | ORIGINAL_REQUEST §R4 |
| 10 | Master Plan Lot Sync | Pass project config to `InteractiveMasterPlan.tsx` and sync selected lot with calculation | M3 | ORIGINAL_REQUEST §R4 |
| 11 | Interactive Financing Calculator | Create `frontend/src/components/FinancingCalculator.tsx` with 3-step breakdown (1M Sep, Net Down Payment, 12M 0% / 24M French 1%) | M3 | ORIGINAL_REQUEST §R4 |
| 12 | Dynamic WhatsApp CTA & Analytics | Generate WhatsApp message with simulation details via `buildWhatsAppUrl` and track with `trackWhatsAppClick` | M3 | ORIGINAL_REQUEST §R4 |
| 13 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test suite for backend, admin, and public financing flows | M4 | Project Pattern Dual Track |
| 14 | Adversarial Coverage Hardening (Tier 5) | White-box adversarial testing, edge cases, formula precision, and integrity verification | M4 | Project Pattern Phase 2 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend & Database Architecture | Flyway V25, `Project.java`, DTO records, `ProjectService`, and `ProjectServiceTest` | none | DONE |
| M2 | Admin Panel Projects Modal & Live Preview | `frontend/src/lib/api.ts`, `frontend/src/app/admin/projects/page.tsx` inputs and live preview card | M1 Contract | DONE |
| M3 | Public Interactive Financing Calculator & Master Plan | `frontend/src/app/proyectos/[slug]/page.tsx`, `InteractiveMasterPlan.tsx`, `FinancingCalculator.tsx`, WhatsApp CTA | M1 Contract, M2 | PLANNED |
| M4 | Final Milestone: 100% E2E Pass & Adversarial Hardening | Phase 1 (Tiers 1-4 E2E validation) + Phase 2 (Tier 5 Adversarial Coverage Hardening) | M1, M2, M3 | PLANNED |

## Interface Contracts

### Backend ↔ Frontend DTO Contract (JSON camelCase)
```json
{
  "hasFinancingCalculator": true,
  "reservationAmount": 1000000.00,
  "downPaymentPercentage": 20.00,
  "interestFreeMonths": 12,
  "interestMonths": 24,
  "monthlyInterestRate": 1.00
}
```

### Financial Formulas Specification
- **Total Price ($P$)**: Selected lot price or custom area $\times$ price per $m^2$.
- **Step 1 — Reservation ($R$)**: $R = \text{reservationAmount}$ (Default: $\$1.000.000\text{ COP}$).
- **Step 2 — 30-Day Down Payment**:
  - Total Down Payment ($DP_{\text{total}}$): $P \times (\text{downPaymentPercentage} / 100)$
  - Net Down Payment Due at 30 days ($DP_{\text{net}}$): $\max(0, DP_{\text{total}} - R)$
  - Financed Balance ($F$): $P - DP_{\text{total}}$ (Exactly 80% when percentage is 20%).
- **Step 3 — Financing Options**:
  - **Option A (12 Months, 0% Interest)**:
    $$\text{Quota}_{12} = \frac{F}{\text{interestFreeMonths}}$$
  - **Option B (24 Months, French Amortization at 1% Monthly Vencido)**:
    $$i = \frac{\text{monthlyInterestRate}}{100} = 0.01$$
    $$\text{Quota}_{24} = F \cdot \frac{i(1+i)^n}{(1+i)^n - 1} \quad \text{where } n = \text{interestMonths} = 24$$
    $$\text{Factor}_{24} = \frac{0.01 \times (1.01)^{24}}{(1.01)^{24} - 1} \approx 0.0470734722$$

## Code Layout
- Backend Migrations: `backend/src/main/resources/db/migration/V25__add_financing_calculator_to_projects.sql`
- Backend Domain: `backend/src/main/java/com/aaasas/inmobiliaria/project/domain/Project.java`
- Backend DTOs: `backend/src/main/java/com/aaasas/inmobiliaria/project/api/`
  - `CreateProjectRequest.java`
  - `UpdateProjectRequest.java`
  - `ProjectDetailResponse.java`
  - `ProjectSummaryResponse.java`
- Backend Service: `backend/src/main/java/com/aaasas/inmobiliaria/project/application/ProjectService.java`
- Backend Tests: `backend/src/test/java/com/aaasas/inmobiliaria/project/application/ProjectServiceTest.java`
- Frontend API Client: `frontend/src/lib/api.ts`
- Frontend Admin Projects: `frontend/src/app/admin/projects/page.tsx`
- Frontend Public Project Page: `frontend/src/app/proyectos/[slug]/page.tsx`
- Frontend Master Plan: `frontend/src/components/InteractiveMasterPlan.tsx`
- Frontend Financing Calculator: `frontend/src/components/FinancingCalculator.tsx`
- Frontend E2E Tests: `frontend/e2e/financing-calculator.spec.ts`
