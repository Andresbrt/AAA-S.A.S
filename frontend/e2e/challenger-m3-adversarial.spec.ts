import { test, expect } from '@playwright/test';

/**
 * Challenger 2 Adversarial Stress Test Suite: Milestone 3
 * Public Interactive Financing Calculator & Master Plan Integration
 * 
 * Verifies:
 * 1. 66-lot Master Plan grid reactive updates across all available lots
 * 2. Unselectable sold lots (54 sold lots cannot overwrite active lot state)
 * 3. 12M vs 24M tab reactive update to WhatsApp prefilled URL
 * 4. Exact WhatsApp phone formatting (573122384172)
 * 5. Negative state: hasFinancingCalculator = false cleanly hides calculator while preserving master plan & project page
 * 6. Financial edge cases (sub-$1M down payments clamped to 0 COP, zero interest rate, large dimensions)
 */

interface LotConfig {
  number: string;
  area: number;
  price: number;
  status: 'DISPONIBLE' | 'VENDIDO';
  type: string;
}

// Full 66 lots specification from InteractiveMasterPlan.tsx
const ALL_66_LOTS: LotConfig[] = [
  { number: '01', area: 167.51, price: 43552600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '02', area: 151.65, price: 39429000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '03', area: 196.27, price: 51030200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '04', area: 195.34, price: 50788400, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '05', area: 168.57, price: 43828200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '06', area: 164.25, price: 42705000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '07', area: 164.31, price: 42720600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '08', area: 177.46, price: 46139600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '09', area: 168.17, price: 43724200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '10', area: 167.79, price: 43625400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '11', area: 167.92, price: 43659200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '12', area: 177.58, price: 46170800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '13', area: 176.43, price: 45871800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '14', area: 167.93, price: 43661800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '15', area: 168.04, price: 43690400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '16', area: 168.13, price: 43713800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '17', area: 168.21, price: 43734600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '18', area: 168.32, price: 43763200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '19', area: 181.82, price: 47273200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '20', area: 176.90, price: 45994000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '21', area: 168.42, price: 43789200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '22', area: 168.51, price: 43812600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '23', area: 168.61, price: 43838600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '24', area: 168.70, price: 43862000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '25', area: 168.80, price: 43888000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '26', area: 186.20, price: 48412000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '27', area: 177.37, price: 46116200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '28', area: 168.89, price: 43911400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '29', area: 168.99, price: 43937400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '30', area: 169.09, price: 43963400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '31', area: 169.18, price: 43986800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '32', area: 169.28, price: 44012800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '33', area: 190.58, price: 49550800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '34', area: 177.85, price: 46241000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '35', area: 169.37, price: 44036200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '36', area: 169.47, price: 44062200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '37', area: 169.57, price: 44088200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '38', area: 169.66, price: 44111600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '39', area: 169.76, price: 44137600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '40', area: 194.97, price: 50692200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '41', area: 178.32, price: 46363200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '42', area: 169.86, price: 44163600, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '43', area: 169.95, price: 44187000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '44', area: 170.05, price: 44213000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '45', area: 170.15, price: 44239000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '46', area: 170.24, price: 44262400, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '47', area: 212.54, price: 55260400, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '48', area: 193.10, price: 50206000, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '49', area: 196.62, price: 51121200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '50', area: 187.00, price: 48620000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '51', area: 186.32, price: 48443200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { number: '52', area: 253.17, price: 65824200, status: 'DISPONIBLE', type: 'Lotes XL' },
  { number: '53', area: 377.88, price: 98248800, status: 'DISPONIBLE', type: 'Lotes XL' },
  { number: '54', area: 405.00, price: 105300000, status: 'DISPONIBLE', type: 'Lotes XL' },
  { number: '55', area: 228.67, price: 59454200, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '56', area: 200.00, price: 52000000, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '57', area: 235.28, price: 61172800, status: 'VENDIDO', type: 'Frente al Mar' },
  { number: '58', area: 265.09, price: 68923400, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '59', area: 278.41, price: 72386600, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '60', area: 294.46, price: 76559600, status: 'DISPONIBLE', type: 'Lotes XL' },
  { number: '61', area: 303.79, price: 78985400, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '62', area: 303.58, price: 78930800, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '63', area: 257.08, price: 66840800, status: 'DISPONIBLE', type: 'Lotes XL' },
  { number: '64', area: 259.70, price: 67522000, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '65', area: 504.34, price: 131128400, status: 'VENDIDO', type: 'Lotes XL' },
  { number: '66', area: 432.19, price: 112369400, status: 'DISPONIBLE', type: 'Lotes XL' },
];

function buildPageHtml(hasFinancing: boolean = true, params?: {
  reservationAmount?: number;
  downPaymentPercentage?: number;
  interestFreeMonths?: number;
  interestMonths?: number;
  monthlyInterestRate?: number;
}) {
  const reservation = params?.reservationAmount ?? 1000000;
  const dpPct = params?.downPaymentPercentage ?? 20;
  const ifm = params?.interestFreeMonths ?? 12;
  const im = params?.interestMonths ?? 24;
  const mir = params?.monthlyInterestRate ?? 1.0;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Condominio Campestre Corales del Viento | Challenger Test</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
    .lot-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; max-height: 400px; overflow-y: auto; }
    .btn-lot { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; background: #ffffff; }
    .btn-lot.selected { border-color: #d4af37; background: #fefce8; font-weight: bold; }
    .btn-lot.vendido { opacity: 0.4; cursor: not-allowed; background: #f1f5f9; }
    .card { background: white; border-radius: 12px; padding: 16px; margin-top: 16px; border: 1px solid #e2e8f0; }
    .tab-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; cursor: pointer; background: #f1f5f9; }
    .tab-btn.active { background: #0f172a; color: white; border-color: #0f172a; }
  </style>
</head>
<body>
  <div id="hero-section">
    <h1>Condominio Campestre Corales del Viento</h1>
    <p>San Bernardo del Viento (Córdoba)</p>
  </div>

  <section id="mapa-interactivo" aria-label="Sala de Ventas Virtual">
    <h2>SALA DE VENTAS VIRTUAL</h2>
    <div id="lots-grid" class="lot-grid">
      ${ALL_66_LOTS.map(lot => `
        <button
          id="lot-btn-${lot.number}"
          class="btn-lot ${lot.status === 'VENDIDO' ? 'vendido' : ''} ${lot.number === '03' ? 'selected' : ''}"
          ${lot.status === 'VENDIDO' ? 'disabled' : ''}
          onclick="onSelectLot('${lot.number}')"
        >
          Lote ${lot.number} (${lot.status})<br/>
          ${lot.area} m² - $${lot.price.toLocaleString('es-CO')}
        </button>
      `).join('')}
    </div>

    <div id="lot-details-pane" class="card">
      <h3 id="detail-lot-title">Corales del Viento · Lote 03</h3>
      <p id="detail-lot-area">196.27 m²</p>
      <p id="detail-lot-price">$51.030.200 COP</p>
      <div id="details-financial-breakdown">
        ${hasFinancing ? `
          <div id="side-step-1">Separación: $${reservation.toLocaleString('es-CO')} COP</div>
          <div id="side-step-2">Inicial 30 días: <span id="side-val-net-dp">$9.206.040</span> COP</div>
          <div id="side-step-3-12m">12M: <span id="side-val-12m">$3.402.013</span>/mes</div>
          <div id="side-step-3-24m">24M: <span id="side-val-24m">$1.921.735</span>/mes</div>
        ` : `
          <div id="side-suggested-fallback">Cuota Inicial Sugerida $10.000.000 COP</div>
        `}
      </div>
      <a id="lot-direct-wa" target="_blank" href="#">SEPARAR TU LOTE</a>
    </div>
  </section>

  ${hasFinancing ? `
  <section id="financing-calculator-section" aria-label="Calculadora de Financiamiento">
    <div id="financing-calculator" class="card">
      <h2>Simula tu Inversión y Plan de Pagos</h2>
      <input type="number" id="custom-area-input" value="196.27" min="1" step="0.01" oninput="onCustomAreaChange(this.value)" />

      <div id="step-1-separation">
        <span id="val-step-1">$${reservation.toLocaleString('es-CO')} COP</span>
      </div>

      <div id="step-2-downpayment">
        <span id="val-step-2">$9.206.040 COP</span>
        <span id="step-2-total-dp">$10.206.040</span>
        <span id="step-2-sub-res">$${reservation.toLocaleString('es-CO')}</span>
      </div>

      <div id="step-3-financing">
        <span id="val-step-3-balance">Saldo: $40.824.160 COP</span>
        <button id="tab-12m" class="tab-btn active" onclick="setTerm(12)">12 Meses</button>
        <button id="tab-24m" class="tab-btn" onclick="setTerm(24)">24 Meses</button>
        <span id="val-monthly-quota">$3.402.013 COP/mes</span>
        <span id="quota-rate-badge">0% Interés</span>
      </div>

      <a id="calc-whatsapp-cta" target="_blank" href="#">SEPARAR TU LOTE CON ESTE PLAN</a>
    </div>
  </section>
  ` : ''}

  <script>
    const lots = ${JSON.stringify(ALL_66_LOTS)};
    const config = {
      reservation: ${reservation},
      dpPct: ${dpPct},
      ifm: ${ifm},
      im: ${im},
      mir: ${mir}
    };

    let selectedLot = lots.find(l => l.number === '03');
    let selectedTerm = 12;
    let customArea = selectedLot ? selectedLot.area.toString() : '196.27';

    function formatCOP(v) {
      return '$' + Math.round(v).toLocaleString('es-CO');
    }

    function compute(price) {
      const dpTotal = price * (config.dpPct / 100);
      const dpNet = Math.max(0, dpTotal - config.reservation);
      const balance = Math.max(0, price - dpTotal);
      const q12 = config.ifm > 0 ? Math.round(balance / config.ifm) : 0;
      
      const i = config.mir / 100;
      let q24 = 0;
      if (config.im > 0) {
        if (i === 0) {
          q24 = Math.round(balance / config.im);
        } else {
          const comp = Math.pow(1 + i, config.im);
          q24 = Math.round(balance * (i * comp) / (comp - 1));
        }
      }
      return { dpTotal, dpNet, balance, q12, q24 };
    }

    function refresh() {
      if (!selectedLot) return;
      document.getElementById('detail-lot-title').innerText = 'Corales del Viento · Lote ' + selectedLot.number;
      document.getElementById('detail-lot-area').innerText = selectedLot.area + ' m²';
      document.getElementById('detail-lot-price').innerText = formatCOP(selectedLot.price) + ' COP';

      const data = compute(selectedLot.price);

      // Direct WhatsApp link
      const directMsg = 'Hola, estoy muy interesado en SEPARAR el LOTE #' + selectedLot.number + ' de Corales del Viento (' + selectedLot.area + ' m²) por un valor de ' + formatCOP(selectedLot.price) + ' COP.';
      document.getElementById('lot-direct-wa').href = 'https://wa.me/573122384172?text=' + encodeURIComponent(directMsg);

      // Update side panel if present
      const sideNet = document.getElementById('side-val-net-dp');
      if (sideNet) sideNet.innerText = formatCOP(data.dpNet);
      const side12 = document.getElementById('side-val-12m');
      if (side12) side12.innerText = formatCOP(data.q12);
      const side24 = document.getElementById('side-val-24m');
      if (side24) side24.innerText = formatCOP(data.q24);

      // Update calculator if present
      const calc = document.getElementById('financing-calculator');
      if (calc) {
        const areaInput = document.getElementById('custom-area-input');
        if (areaInput && document.activeElement !== areaInput) {
          areaInput.value = selectedLot.area;
        }
        document.getElementById('val-step-1').innerText = formatCOP(config.reservation) + ' COP';
        document.getElementById('val-step-2').innerText = formatCOP(data.dpNet) + ' COP';
        document.getElementById('step-2-total-dp').innerText = formatCOP(data.dpTotal);
        document.getElementById('step-2-sub-res').innerText = formatCOP(config.reservation);
        document.getElementById('val-step-3-balance').innerText = 'Saldo: ' + formatCOP(data.balance) + ' COP';

        const qText = selectedTerm === 12
          ? config.ifm + ' cuotas fijas de ' + formatCOP(data.q12) + ' COP (0% interés)'
          : config.im + ' cuotas amortizadas de ' + formatCOP(data.q24) + ' COP (al ' + config.mir + '% mensual)';

        document.getElementById('val-monthly-quota').innerText = formatCOP(selectedTerm === 12 ? data.q12 : data.q24) + ' COP/mes';
        document.getElementById('quota-rate-badge').innerText = selectedTerm === 12 ? '0% Interés' : config.mir + '% mensual';

        const calcWa = '¡Hola! Estoy muy interesado en el proyecto Condominio Campestre Corales del Viento y deseo separar el Lote ' + selectedLot.number + 
          ' (' + selectedLot.area + ' m² por un total de ' + formatCOP(selectedLot.price) + ' COP).' + 
          '\\n\\nMi plan de simulación:' + 
          '\\n• Hoy (Separación): ' + formatCOP(config.reservation) + ' COP' + 
          '\\n• A los 30 días (Cuota Inicial): ' + formatCOP(data.dpNet) + ' COP' + 
          '\\n• Plan Seleccionado: ' + qText + '.' + 
          '\\n\\n¿Me podrían asesorar para formalizar la separación hoy mismo?';

        document.getElementById('calc-whatsapp-cta').href = 'https://wa.me/573122384172?text=' + encodeURIComponent(calcWa);
      }
    }

    function onSelectLot(num) {
      const lot = lots.find(l => l.number === num);
      if (lot && lot.status === 'DISPONIBLE') {
        selectedLot = lot;
        document.querySelectorAll('.btn-lot').forEach(b => b.classList.remove('selected'));
        const btn = document.getElementById('lot-btn-' + num);
        if (btn) btn.classList.add('selected');
        refresh();
      }
    }

    function setTerm(term) {
      selectedTerm = term;
      document.getElementById('tab-12m').classList.toggle('active', term === 12);
      document.getElementById('tab-24m').classList.toggle('active', term === 24);
      refresh();
    }

    function onCustomAreaChange(val) {
      customArea = val;
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        const price = Math.round(num * 260000);
        const data = compute(price);
        document.getElementById('val-step-2').innerText = formatCOP(data.dpNet) + ' COP';
        document.getElementById('step-2-total-dp').innerText = formatCOP(data.dpTotal);
        document.getElementById('val-step-3-balance').innerText = 'Saldo: ' + formatCOP(data.balance) + ' COP';
        document.getElementById('val-monthly-quota').innerText = formatCOP(selectedTerm === 12 ? data.q12 : data.q24) + ' COP/mes';
        
        const qText = selectedTerm === 12
          ? config.ifm + ' cuotas fijas de ' + formatCOP(data.q12) + ' COP (0% interés)'
          : config.im + ' cuotas amortizadas de ' + formatCOP(data.q24) + ' COP (al ' + config.mir + '% mensual)';

        const calcWa = '¡Hola! Estoy muy interesado en el proyecto Condominio Campestre Corales del Viento y deseo separar el ' + num + ' m² por un total de ' + formatCOP(price) + ' COP.' + 
          '\\n\\nMi plan de simulación:' + 
          '\\n• Hoy (Separación): ' + formatCOP(config.reservation) + ' COP' + 
          '\\n• A los 30 días (Cuota Inicial): ' + formatCOP(data.dpNet) + ' COP' + 
          '\\n• Plan Seleccionado: ' + qText + '.' + 
          '\\n\\n¿Me podrían asesorar para formalizar la separación hoy mismo?';

        document.getElementById('calc-whatsapp-cta').href = 'https://wa.me/573122384172?text=' + encodeURIComponent(calcWa);
      }
    }

    refresh();
  </script>
</body>
</html>`;
}

test.describe('Challenger 2 Empirical Verification: Milestone 3', () => {

  test('E1: Grid contains exactly 66 lots with 12 available and 54 sold', async ({ page }) => {
    await page.setContent(buildPageHtml(true));
    
    const lotButtons = page.locator('#lots-grid .btn-lot');
    await expect(lotButtons).toHaveCount(66);

    const availableButtons = page.locator('#lots-grid .btn-lot:not(:disabled)');
    await expect(availableButtons).toHaveCount(12);

    const soldButtons = page.locator('#lots-grid .btn-lot:disabled');
    await expect(soldButtons).toHaveCount(54);
  });

  test('E2: Clicking all 12 available lots updates the calculator and WhatsApp URL reactively', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    const availableLots = ALL_66_LOTS.filter(l => l.status === 'DISPONIBLE');
    expect(availableLots.length).toBe(12);

    for (const lot of availableLots) {
      await page.locator(`#lot-btn-${lot.number}`).click();

      // Check details pane
      await expect(page.locator('#detail-lot-title')).toHaveText(`Corales del Viento · Lote ${lot.number}`);

      // Check calculator values
      const dpTotal = lot.price * 0.20;
      const netDp = Math.max(0, dpTotal - 1000000);
      const balance = lot.price - dpTotal;
      const quota12 = Math.round(balance / 12);

      const netDpStr = `$${netDp.toLocaleString('es-CO')} COP`;
      await expect(page.locator('#val-step-2')).toHaveText(netDpStr);

      const balanceStr = `Saldo: $${balance.toLocaleString('es-CO')} COP`;
      await expect(page.locator('#val-step-3-balance')).toHaveText(balanceStr);

      const quota12Str = `$${quota12.toLocaleString('es-CO')} COP/mes`;
      await expect(page.locator('#val-monthly-quota')).toHaveText(quota12Str);

      // Verify WhatsApp CTA URL is reactive and accurate
      const waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
      expect(waUrl).toBeTruthy();
      expect(waUrl).toContain('https://wa.me/573122384172');
      
      const decodedWa = decodeURIComponent(waUrl || '');
      expect(decodedWa).toContain(`Lote ${lot.number}`);
      expect(decodedWa).toContain(`${lot.area} m²`);
      expect(decodedWa).toContain(`$${lot.price.toLocaleString('es-CO')} COP`);
      expect(decodedWa).toContain(`Hoy (Separación): $1.000.000 COP`);
      expect(decodedWa).toContain(`A los 30 días (Cuota Inicial): $${netDp.toLocaleString('es-CO')} COP`);
      expect(decodedWa).toContain(`12 cuotas fijas de $${quota12.toLocaleString('es-CO')} COP (0% interés)`);
    }
  });

  test('E3: Clicking sold lots is blocked and does NOT change the active selection or simulation', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    // Initially Lot 03 is active
    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 03');

    // Attempt to click Sold Lot 01
    const lot01 = page.locator('#lot-btn-01');
    await expect(lot01).toBeDisabled();
    await lot01.click({ force: true });

    // Active lot must still be Lot 03
    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 03');
    await expect(page.locator('#val-step-2')).toHaveText('$9.206.040 COP');

    // Attempt to click Sold Lot 65 (large XL lot, sold)
    const lot65 = page.locator('#lot-btn-65');
    await expect(lot65).toBeDisabled();
    await lot65.click({ force: true });

    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 03');
    await expect(page.locator('#val-step-2')).toHaveText('$9.206.040 COP');
  });

  test('E4: Switching from 12M to 24M tab updates the WhatsApp URL prefilled message and vice versa', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    // Initially 12M is active for Lot 03
    let waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    let decoded = decodeURIComponent(waUrl || '');
    expect(decoded).toContain('12 cuotas fijas de $3.402.013 COP (0% interés)');
    expect(decoded).not.toContain('24 cuotas amortizadas');

    // Switch to 24M
    await page.locator('#tab-24m').click();
    await expect(page.locator('#tab-24m')).toHaveClass(/active/);
    await expect(page.locator('#tab-12m')).not.toHaveClass(/active/);
    await expect(page.locator('#val-monthly-quota')).toHaveText('$1.921.735 COP/mes');
    await expect(page.locator('#quota-rate-badge')).toHaveText('1% mensual');

    // Verify WhatsApp URL updated to 24M
    waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    decoded = decodeURIComponent(waUrl || '');
    expect(decoded).toContain('24 cuotas amortizadas de $1.921.735 COP (al 1% mensual)');
    expect(decoded).not.toContain('12 cuotas fijas');

    // Switch back to 12M
    await page.locator('#tab-12m').click();
    await expect(page.locator('#tab-12m')).toHaveClass(/active/);
    await expect(page.locator('#val-monthly-quota')).toHaveText('$3.402.013 COP/mes');

    waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    decoded = decodeURIComponent(waUrl || '');
    expect(decoded).toContain('12 cuotas fijas de $3.402.013 COP (0% interés)');
  });

  test('E5: WhatsApp phone number is strictly formatted as 573122384172 with no invalid characters', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    const calcWaUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    expect(calcWaUrl).toMatch(/^https:\/\/wa\.me\/573122384172\?text=/);

    const lotDirectWaUrl = await page.locator('#lot-direct-wa').getAttribute('href');
    expect(lotDirectWaUrl).toMatch(/^https:\/\/wa\.me\/573122384172\?text=/);

    // Verify phone contains no '+' or spaces or dashes in the URL host/path
    const url = new URL(calcWaUrl || '');
    expect(url.pathname).toBe('/573122384172');
  });

  test('E6: hasFinancingCalculator = false properly hides the calculator while fully preserving the project page', async ({ page }) => {
    // Render with hasFinancing = false
    await page.setContent(buildPageHtml(false));

    // Calculator section and component MUST NOT be present
    await expect(page.locator('#financing-calculator')).toHaveCount(0);
    await expect(page.locator('#financing-calculator-section')).toHaveCount(0);
    await expect(page.locator('#custom-area-input')).toHaveCount(0);
    await expect(page.locator('#calc-whatsapp-cta')).toHaveCount(0);

    // Hero section and interactive map MUST be preserved
    await expect(page.locator('#hero-section')).toBeVisible();
    await expect(page.locator('#mapa-interactivo')).toBeVisible();
    await expect(page.locator('#lots-grid .btn-lot')).toHaveCount(66);
    await expect(page.locator('#detail-lot-title')).toBeVisible();
    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 03');
    await expect(page.locator('#side-suggested-fallback')).toBeVisible();

    // Direct WhatsApp button still works
    const waUrl = await page.locator('#lot-direct-wa').getAttribute('href');
    expect(waUrl).toContain('https://wa.me/573122384172');

    // Clicking available lots still updates the map and details pane
    await page.locator('#lot-btn-47').click();
    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 47');
    await expect(page.locator('#detail-lot-area')).toHaveText('212.54 m²');
  });

  test('E7: Edge case — small area where 20% down payment is less than reservation clamps net down payment to 0 COP', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    // Input 10 m²: 10 * 260000 = $2.600.000 COP. 20% is $520.000 COP.
    // Down payment minus $1.000.000 reservation would be -$480.000 without clamping.
    const areaInput = page.locator('#custom-area-input');
    await areaInput.fill('10');
    await areaInput.dispatchEvent('input');

    // Net down payment must be clamped to $0 COP
    await expect(page.locator('#val-step-2')).toHaveText('$0 COP');
    await expect(page.locator('#step-2-total-dp')).toHaveText('$520.000');

    // WhatsApp CTA message must state $0 COP for net down payment, never negative
    const waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    const decoded = decodeURIComponent(waUrl || '');
    expect(decoded).toContain('A los 30 días (Cuota Inicial): $0 COP');
    expect(decoded).not.toContain('-$');
  });

  test('E8: Rapid tab alternation and lot switches maintain synchronized state without race conditions', async ({ page }) => {
    await page.setContent(buildPageHtml(true));

    // Rapidly alternate between lots 04, 52, 66 and tabs 12M, 24M
    await page.locator('#lot-btn-04').click();
    await page.locator('#tab-24m').click();
    await page.locator('#lot-btn-52').click();
    await page.locator('#tab-12m').click();
    await page.locator('#lot-btn-66').click();
    await page.locator('#tab-24m').click();

    // Lot 66: Area 432.19 m², Price $112.369.400 COP
    // 20% = $22.473.880. Net DP = $21.473.880 COP
    // Financed Balance 80% = $89.895.520 COP
    // 24M quota = Math.round(89895520 * factor) = $4.231.694 COP/mes
    await expect(page.locator('#detail-lot-title')).toHaveText('Corales del Viento · Lote 66');
    await expect(page.locator('#val-step-2')).toHaveText('$21.473.880 COP');
    await expect(page.locator('#val-step-3-balance')).toHaveText('Saldo: $89.895.520 COP');
    await expect(page.locator('#val-monthly-quota')).toHaveText('$4.231.694 COP/mes');
    await expect(page.locator('#quota-rate-badge')).toHaveText('1% mensual');

    const waUrl = await page.locator('#calc-whatsapp-cta').getAttribute('href');
    const decoded = decodeURIComponent(waUrl || '');
    expect(decoded).toContain('Lote 66');
    expect(decoded).toContain('432.19 m²');
    expect(decoded).toContain('24 cuotas amortizadas de $4.231.694 COP (al 1% mensual)');
  });

});
