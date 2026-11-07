# Test Infrastructure & Methodology — Grupo AAA

## 1. Overview & Architecture
The End-to-End (E2E) testing infrastructure for the Grupo AAA portal (specifically the Interactive Financing Calculator for Corales del Viento and future real estate developments) is built with **Playwright Test** (`@playwright/test` v1.63.0) and **TypeScript 5**.

The test suite operates as an opaque-box verification system:
- Tests interact with the user-visible surface: accessible ARIA roles (`region`, `heading`, `button`), form labels, input values, formatted currency strings in Colombian Pesos (`COP`), and outgoing WhatsApp URLs.
- Tests do not rely on fragile implementation details or component internal states.
- Sandboxed and CI-friendly execution: Playwright DevTools route interception isolates tests from external network dependencies or locked database ports while executing authentic Chromium browser rendering, DOM manipulation, event handling, and real-time reactive calculations.

---

## 2. The 4-Tier Testing Methodology

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 4: Real-World Application Scenarios (Buyer & Admin)    │
├─────────────────────────────────────────────────────────────┤
│ Tier 3: Cross-Feature Interactions (Pairwise & State Sync)  │
├─────────────────────────────────────────────────────────────┤
│ Tier 2: Boundary & Corner Cases (Extreme, Zero, Luxury)     │
├─────────────────────────────────────────────────────────────┤
│ Tier 1: Feature Coverage (>=5 Tests Per Core Feature)       │
└─────────────────────────────────────────────────────────────┘
```

### Tier 1 — Core Feature Coverage (>=5 Tests per Feature, 35 Tests Total)
1. **Toggle Visibility (`hasFinancingCalculator`)**:
   - 1.1: Section rendering when flag is `true`.
   - 1.2: Section concealment when flag is `false`.
   - 1.3: Default activation for Corales del Viento fallback.
   - 1.4: Preservation of standard lot details and brochures when calculator is disabled.
   - 1.5: Accessibility ARIA landmark validation (`section[aria-label="Calculadora de Financiamiento"]`).
2. **Default Separation Amount ($1.000.000 COP)**:
   - 2.1: Formatting and default display of `$1.000.000 COP` in Step 1.
   - 2.2: Explanatory text that reservation is paid today to freeze lot price.
   - 2.3: Deduction in Step 2 down payment breakdown.
   - 2.4: Invariance of separation amount when changing lot selection.
   - 2.5: Custom `reservationAmount` parameter support.
3. **Down Payment Calculation (20% with Separation Subtracted at 30 Days)**:
   - 3.1: Standard 20% calculation on Lote 03 ($51.030.200 COP -> $9.206.040 net).
   - 3.2: Net down payment calculation on Lote 47 ($55.260.400 COP -> $10.052.080 net).
   - 3.3: Net down payment calculation on Lote 53 XL ($98.248.800 COP -> $18.649.760 net).
   - 3.4: Financed balance equals exactly 80% ($40.824.160 COP for Lote 03).
   - 3.5: Custom down payment percentage support (e.g., 30% -> $14.309.060 net).
4. **12-Month Interest-Free Option (Saldo / 12)**:
   - 4.1: Option A tab active by default with "0% Interés" badge.
   - 4.2: Exact quota for Lote 03 ($40.824.160 / 12 = $3.402.013 COP/month).
   - 4.3: Exact quota for Lote 47 ($44.208.320 / 12 = $3.684.027 COP/month).
   - 4.4: Exact quota for Lote 53 XL ($78.599.040 / 12 = $6.549.920 COP/month).
   - 4.5: Mathematical zero-leakage check: $\sum_{1}^{12} \text{Quota} \approx F$.
5. **24-Month French Amortization Option at 1% Monthly Vencido**:
   - 5.1: Tab switching activates 24-month mode and updates rate badge to "1% mensual".
   - 5.2: French amortization quota for Lote 03: $C = F \cdot \frac{i(1+i)^{24}}{(1+i)^{24}-1} = \$1.921.735\text{ COP/month}$.
   - 5.3: French amortization quota for Lote 47 ($44.208.320): $\$2.081.039\text{ COP/month}$.
   - 5.4: French amortization factor verification: for $i=0.01$ and $n=24$, $\text{factor} \approx 0.04707347$.
   - 5.5: Instantaneous live tab switching between 12M and 24M without latency.
6. **Dynamic WhatsApp CTA & Prefilled Message Breakdown**:
   - 6.1: Corporate WhatsApp endpoint verification (`https://wa.me/573122384172`).
   - 6.2: Complete metadata encoding: project name, selected lot, total price.
   - 6.3: Multi-step financial breakdown in message text (Separation, 30-day initial, monthly plan).
   - 6.4: Reactive sync of selected installment plan in message (12M vs 24M).
   - 6.5: New tab behavior verification (`target="_blank"`).
7. **Admin Panel Modal Inputs & Live Reactive Preview**:
   - 7.1: Modal structure and "Calculadora de Financiamiento" fieldset.
   - 7.2: Presence of 5 numeric inputs initialized to Flyway V25 defaults.
   - 7.3: Real-time recalculation of down payment in modal preview card upon input changes.
   - 7.4: Real-time recalculation of 24-month French quota upon interest rate modification.
   - 7.5: Toggle switch dynamically showing/hiding parameter inputs.

### Tier 2 — Boundary & Corner Cases (5 Tests)
- **2.B1 (Small Lot / Minimum Area)**: 50 m² lot ($13.000.000 COP) -> $1M separation, $1.6M at 30 days, $866.667/month for 12 months.
- **2.B2 (Luxury Lot / High Price)**: 2000 m² lot ($520.000.000 COP) -> $103M at 30 days, $34.666.667/month for 12M, $19.582.564/month for 24M.
- **2.B3 (Percentage Boundaries)**: 10%, 50%, and 90% down payment mathematical validation.
- **2.B4 (Separation Exceeds Down Payment)**: Lot price $3.900.000 COP where 20% is $780.000 COP (< $1.000.000 separation). Net down payment clamped to $0 COP (never negative).
- **2.B5 (Zero Interest Rate Edge Case)**: 0% interest rate on extended term handles gracefully without `NaN` or division by zero.

### Tier 3 — Cross-Feature Interactions (Pairwise, 4 Tests)
- **3.1 (Master Plan Lot Sync)**: Clicking a new lot in the Master Plan (Lote 03 -> Lote 47) simultaneously updates details card, calculator totals, 30-day net payment, monthly quotas, and WhatsApp link.
- **3.2 (Filters + Selection + Calculator)**: Changing category filter ("Lotes XL"), selecting Lote 52 XL (253.17 m²), and verifying simulation recalculates with lot price ($65.824.200 COP).
- **3.3 (Admin Parameter Persistence & Public View Sync)**: Modifying project parameters in Admin ($2M separation, 25% down payment) persists to backend API and reflects in public view.
- **3.4 (Tab Switch State Retention)**: Switching between 12M and 24M retains active lot selection and updates WhatsApp message text without losing context.

### Tier 4 — Real-World Application Scenarios (3 Tests)
- **4.1 (Corales del Viento Lote 03 Full Purchase Journey)**:
  1. Visit public project URL `/proyectos/corales-del-viento`.
  2. Scroll to Sala de Ventas Virtual and select Lote 03 (196.27 m², $51.030.200 COP).
  3. Validate Step 1 ($1.000.000), Step 2 ($9.206.040), Step 3 12M ($3.402.013/month).
  4. Compare with 24M option ($1.921.735/month).
  5. Click WhatsApp CTA and verify full URI parameters.
- **4.2 (Custom Area Simulation Journey)**:
  Buyer types a custom area (250 m² at $260.000/m² = $65.000.000 COP) -> calculator recalculates Step 1 ($1M), Step 2 ($12M), 12M ($4.333.333), 24M ($2.447.821), and generates custom WhatsApp simulation.
- **4.3 (Admin Parameter Reconfiguration Journey)**:
  Admin navigates to `/admin/projects`, opens Corales del Viento, adjusts interest rate to 1.5% and term to 36 months, verifies live modal preview card displays recalculated quota ($1.475.891/month), and saves.

---

## 3. Feature Inventory & Test Mapping

| Feature # | Feature Name | Test Group | Total Tests | Status |
|-----------|--------------|------------|-------------|--------|
| F1 | Toggle Visibility (`hasFinancingCalculator`) | Tier 1.1 | 5 | PASSED |
| F2 | Default Separation Amount ($1M COP) | Tier 1.2 | 5 | PASSED |
| F3 | Down Payment Calculation (20% Net at 30 Days) | Tier 1.3 | 5 | PASSED |
| F4 | 12-Month Interest-Free Option (Saldo / 12) | Tier 1.4 | 5 | PASSED |
| F5 | 24-Month French Amortization (1% Monthly) | Tier 1.5 | 5 | PASSED |
| F6 | WhatsApp Prefilled URL Generation | Tier 1.6 | 5 | PASSED |
| F7 | Admin Panel Modal & Live Preview Card | Tier 1.7 | 5 | PASSED |
| F8 | Boundary & Corner Cases (Extreme lots, 0%, luxury) | Tier 2 | 5 | PASSED |
| F9 | Cross-Feature Interactions & Master Plan Sync | Tier 3 | 4 | PASSED |
| F10 | Real-World Buyer & Admin Full Journeys | Tier 4 | 3 | PASSED |
| **Total** | **Complete Suite** | **Tiers 1-4** | **47** | **100% PASSED** |

---

## 4. Execution & Verification Commands

### Run Full Financing Calculator E2E Suite:
```bash
cd frontend && PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test e2e/financing-calculator.spec.ts --reporter=list
```

### Typecheck Frontend & Tests:
```bash
cd frontend && npx tsc --noEmit
```

### Run All E2E Suites:
```bash
cd frontend && PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test --reporter=list
```
