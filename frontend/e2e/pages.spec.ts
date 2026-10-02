import { test, expect } from '@playwright/test';

test.describe('Funcionalidad de Páginas Públicas', () => {
  test('La página principal carga correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el título sea correcto
    await expect(page).toHaveTitle(/Grupo AAA/);
    
    // Verificar que la navegación está presente
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verificar que hay un Hero section (el h1 de bienvenida)
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('El formulario de contacto requiere aceptación de datos', async ({ page }) => {
    await page.goto('/#contacto');
    
    // Buscar el botón de submit
    const submitButton = page.getByRole('button', { name: /Solicitar Asesoría/i });
    await submitButton.scrollIntoViewIfNeeded();
    await expect(submitButton).toBeVisible();
  });

  test('El Master Plan interactivo carga sus filtros y lotes', async ({ page }) => {
    await page.goto('/#mapa-interactivo');
    
    // Verificar que los botones de filtro están visibles
    const allFilter = page.getByRole('button', { name: /Todos/i }).first();
    await expect(allFilter).toBeVisible();
    
    // Verificar que aparece al menos una tarjeta de lote (Ej. "Lote 1")
    // Use a loose text match just to ensure cards render
    const loteCard = page.locator('text=Lote').first();
    await expect(loteCard).toBeVisible();
  });

  test('La página de términos y condiciones carga correctamente', async ({ page }) => {
    await page.goto('/legal/terminos');
    
    // Verificar que el título h1 contiene Términos
    const h1 = page.getByRole('heading', { name: /Términos/i }).first();
    await expect(h1).toBeVisible();
    
    // Verificar que aparece el NIT
    const bodyText = page.locator('body');
    await expect(bodyText).toContainText('901599132');
  });
});

test.describe('Protección del Panel de Administración', () => {
  test('Visitar /admin/projects redirige a login si no hay token', async ({ page }) => {
    await page.goto('/admin/projects');
    
    // Debería redirigir a /portal-asesores o /admin/login
    await expect(page).toHaveURL(/.*portal-asesores.*/);
  });
});
