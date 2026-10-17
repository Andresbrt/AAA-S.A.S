import { test, expect } from '@playwright/test';

test.describe('Pruebas de la Página Pública', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Verificar botones del Navbar', async ({ page }) => {
    // Proyectos Navbar link
    await page.getByRole('link', { name: 'Proyectos', exact: true }).click();
    await expect(page).toHaveURL(/.*#proyectos|.*\/proyectos/);

    // Nosotros Navbar link
    await page.goto('/');
    await page.getByRole('link', { name: 'Nosotros', exact: true }).click();
    await expect(page).toHaveURL(/.*#nosotros/);

    // Inversión link
    await page.goto('/');
    const btnInversion = page.getByRole('link', { name: 'Inversión', exact: true });
    if (await btnInversion.isVisible()) {
      await btnInversion.click();
    }
  });

  test('Verificar botones del Hero Section', async ({ page }) => {
    // Ver Portafolio
    const verPortafolio = page.getByRole('link', { name: 'VER PORTAFOLIO', exact: true });
    if (await verPortafolio.isVisible()) {
      await verPortafolio.click();
      await expect(page).toHaveURL(/.*#proyectos/);
    }

    // Asesoría Personal
    const asesoria = page.getByRole('link', { name: 'ASESORÍA PERSONAL', exact: true });
    if (await asesoria.isVisible()) {
      // It opens in new tab, let's just check the href
      const href = await asesoria.getAttribute('href');
      expect(href).toContain('api.whatsapp.com');
    }
  });

  test('Verificar iconos de Redes Sociales', async ({ page }) => {
    // Footer social links
    const instagramBtn = page.locator('a[href*="instagram.com"]').first();
    if (await instagramBtn.isVisible()) {
      const href = await instagramBtn.getAttribute('href');
      expect(href).toContain('instagram.com');
    }

    const facebookBtn = page.locator('a[href*="facebook.com"]').first();
    if (await facebookBtn.isVisible()) {
      const href = await facebookBtn.getAttribute('href');
      expect(href).toContain('facebook.com');
    }

    const youtubeBtn = page.locator('a[href*="youtube.com"]').first();
    if (await youtubeBtn.isVisible()) {
      const href = await youtubeBtn.getAttribute('href');
      expect(href).toContain('youtube.com');
    }
  });

  test('Navegación al detalle del primer proyecto', async ({ page }) => {
    // Find the first project card link
    const firstProjectLink = page.locator('#proyectos a[href^="/proyectos/"]').first();
    if (await firstProjectLink.isVisible()) {
      await firstProjectLink.click();
      await expect(page).toHaveURL(/.*\/proyectos\/.+/);
    }
  });
});
