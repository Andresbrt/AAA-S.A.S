import { test, expect } from '@playwright/test';

test.describe('Flujos Interactivos Críticos — Grupo AAA', () => {

  test('Validación de Consentimiento Ley 1581 (Habeas Data) en Formulario de Contacto', async ({ page }) => {
    await page.goto('/#contacto');
    
    // Fill contact inputs
    await page.locator('input[name="fullName"]').fill('Auditoría Test');
    await page.locator('input[name="email"]').fill('auditoria@grupoaaa.com');
    await page.locator('input[name="phone"]').fill('3001234567');
    
    // Ensure consent checkbox is UNCHECKED
    const consentCheckbox = page.locator('#dataConsent');
    if (await consentCheckbox.isChecked()) {
      await consentCheckbox.uncheck();
    }
    
    // Attempt form submission without consent
    const submitBtn = page.getByRole('button', { name: /Solicitar Asesoría/i });
    await submitBtn.click();
    
    // Verify toast error message matching ContactForm.tsx verbatim
    const toastError = page.locator('text=Debes autorizar el tratamiento de datos personales (Ley 1581)');
    await expect(toastError).toBeVisible({ timeout: 5000 });
    
    // Now check consent
    await consentCheckbox.check();
    expect(await consentCheckbox.isChecked()).toBe(true);
  });

  test('Interacción con Master Plan 66 Lotes y Cálculo Financiero', async ({ page }) => {
    await page.goto('/proyectos/corales-del-viento');
    
    // Scroll to Master Plan / Sala de Ventas Virtual section
    const masterPlanSection = page.locator('#mapa-interactivo, #master-plan');
    await masterPlanSection.scrollIntoViewIfNeeded();
    await expect(masterPlanSection.first()).toBeVisible();

    // Select Lot 3 (Lote 03)
    const lotButton = page.locator('button:has-text("Lote 03")').first();
    await lotButton.click();

    // Verify Lot Details Pane / Card opens with Lote 03
    const detailsPane = page.locator('text=Corales del Viento · Lote 03').first();
    await expect(detailsPane).toBeVisible();

    // Verify Lot dimensions & price math: 196.27 m² * $260.000 COP = $51.030.200 COP
    const bodyContent = page.locator('body');
    await expect(bodyContent).toContainText('196.27');
    await expect(bodyContent).toContainText('51.030.200');

    // Verify WhatsApp reservation CTA is present and configured
    const whatsappBtn = page.getByRole('button', { name: /SEPARAR TU LOTE/i });
    await expect(whatsappBtn).toBeVisible();
  });

  test('Ergonomía Móvil y Touch Targets en Viewport 375x812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/proyectos');

    // Verify filter pills have min-h-[44px]
    const filterPills = page.locator('button:has-text("Todos"), button:has-text("Frente al Mar")');
    const firstPill = filterPills.first();
    await expect(firstPill).toBeVisible();
    const box = await firstPill.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
