import { test, expect } from '@playwright/test'

test.describe('TaxFlow-ES Spanish Features E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar usuario de prueba y datos iniciales
    await page.goto('http://localhost:7331')
    
    // Mock autenticación o login automático para testing
    // Esto dependerá de tu sistema de autenticación
  })

  test.describe('Spanish Tax Validation', () => {
    test('should validate NIF/CIF in transaction form', async ({ page }) => {
      // Navegar al formulario de transacciones
      await page.goto('http://localhost:7331/transactions/new')
      
      // Introducir un NIF válido
      await page.fill('[data-testid="supplier-tax-id"]', 'B12345678')
      await page.fill('[data-testid="supplier-name"]', 'Empresa Test SL')
      await page.fill('[data-testid="base-amount"]', '100')
      await page.fill('[data-testid="vat-rate"]', '21')
      
      // El sistema debe calcular automáticamente el IVA
      const vatAmount = page.locator('[data-testid="vat-amount"]')
      await expect(vatAmount).toHaveValue('21')
      
      // Verificar que no hay errores de validación
      const validationErrors = page.locator('[data-testid="validation-errors"]')
      await expect(validationErrors).not.toBeVisible()
      
      // El formulario debe ser válido para envío
      const submitButton = page.locator('[data-testid="submit-transaction"]')
      await expect(submitButton).toBeEnabled()
    })

    test('should show validation errors for invalid NIF', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions/new')
      
      // Introducir un NIF inválido
      await page.fill('[data-testid="supplier-tax-id"]', 'INVALID123')
      await page.blur('[data-testid="supplier-tax-id"]')
      
      // Debe mostrar error de validación
      const errorMessage = page.locator('[data-testid="tax-id-error"]')
      await expect(errorMessage).toBeVisible()
      await expect(errorMessage).toContainText('NIF/CIF no tiene un formato válido')
      
      // El botón de envío debe estar deshabilitado
      const submitButton = page.locator('[data-testid="submit-transaction"]')
      await expect(submitButton).toBeDisabled()
    })

    test('should detect inconsistent VAT calculations', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions/new')
      
      await page.fill('[data-testid="supplier-tax-id"]', 'B12345678')
      await page.fill('[data-testid="base-amount"]', '100')
      await page.fill('[data-testid="vat-rate"]', '21')
      await page.fill('[data-testid="vat-amount"]', '15') // Incorrecto: debería ser 21
      
      await page.blur('[data-testid="vat-amount"]')
      
      // Debe mostrar alerta de IVA incoherente
      const vatError = page.locator('[data-testid="vat-validation-error"]')
      await expect(vatError).toBeVisible()
      await expect(vatError).toContainText('IVA incoherente')
    })

    test('should suggest IRPF for professional services', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions/new')
      
      await page.fill('[data-testid="supplier-tax-id"]', '12345678Z') // NIF persona física
      await page.selectOption('[data-testid="category"]', 'servicios_profesionales')
      await page.fill('[data-testid="base-amount"]', '1000')
      
      // Debe sugerir IRPF
      const irpfSuggestion = page.locator('[data-testid="irpf-suggestion"]')
      await expect(irpfSuggestion).toBeVisible()
      await expect(irpfSuggestion).toContainText('Se esperaba retención IRPF')
    })
  })

  test.describe('Spanish Export Features', () => {
    test('should export Libro de Gastos', async ({ page }) => {
      await page.goto('http://localhost:7331/export')
      
      // Abrir diálogo de exportes españoles
      await page.click('[data-testid="spain-exports-button"]')
      
      // Seleccionar Libro de Gastos
      await page.selectOption('[data-testid="export-type"]', 'libro-gastos')
      await page.selectOption('[data-testid="export-year"]', '2024')
      
      // Iniciar descarga
      const downloadPromise = page.waitForDownload()
      await page.click('[data-testid="export-button"]')
      const download = await downloadPromise
      
      // Verificar nombre de archivo
      expect(download.suggestedFilename()).toContain('libro-gastos-2024.csv')
    })

    test('should export Modelo 303', async ({ page }) => {
      await page.goto('http://localhost:7331/export')
      
      await page.click('[data-testid="spain-exports-button"]')
      
      // Seleccionar Modelo 303
      await page.selectOption('[data-testid="export-type"]', 'modelo-303')
      await page.selectOption('[data-testid="export-year"]', '2024')
      await page.selectOption('[data-testid="export-quarter"]', '1')
      
      const downloadPromise = page.waitForDownload()
      await page.click('[data-testid="export-button"]')
      const download = await downloadPromise
      
      expect(download.suggestedFilename()).toContain('modelo-303-2024-T1.json')
    })

    test('should show export options correctly', async ({ page }) => {
      await page.goto('http://localhost:7331/export')
      
      await page.click('[data-testid="spain-exports-button"]')
      
      // Verificar que todas las opciones están disponibles
      const exportTypes = page.locator('[data-testid="export-type"] option')
      await expect(exportTypes).toHaveCount(4)
      
      const expectedOptions = [
        'Libro de Gastos',
        'Libro de Ingresos', 
        'Resumen Modelo 303',
        'Resumen Modelo 130'
      ]
      
      for (const option of expectedOptions) {
        await expect(page.locator(`text="${option}"`)).toBeVisible()
      }
    })

    test('should show quarter selector only for Modelo exports', async ({ page }) => {
      await page.goto('http://localhost:7331/export')
      await page.click('[data-testid="spain-exports-button"]')
      
      // Para Libro de Gastos no debe mostrar trimestre
      await page.selectOption('[data-testid="export-type"]', 'libro-gastos')
      await expect(page.locator('[data-testid="export-quarter"]')).not.toBeVisible()
      
      // Para Modelo 303 sí debe mostrar trimestre
      await page.selectOption('[data-testid="export-type"]', 'modelo-303')
      await expect(page.locator('[data-testid="export-quarter"]')).toBeVisible()
    })
  })

  test.describe('Transaction List with Spanish Fields', () => {
    test('should display Spanish fiscal information', { tag: '@slow' }, async ({ page }) => {
      await page.goto('http://localhost:7331/transactions')
      
      // Verificar que se muestran campos españoles
      await expect(page.locator('[data-testid="supplier-tax-id-column"]')).toBeVisible()
      await expect(page.locator('[data-testid="invoice-number-column"]')).toBeVisible()
      await expect(page.locator('[data-testid="vat-amount-column"]')).toBeVisible()
      await expect(page.locator('[data-testid="deductible-column"]')).toBeVisible()
    })

    test('should filter by deductible status', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions')
      
      // Aplicar filtro de deducibles
      await page.check('[data-testid="filter-deductible-only"]')
      
      // Verificar que solo se muestran transacciones deducibles
      const deductibleBadges = page.locator('[data-testid="deductible-badge"][data-value="true"]')
      const nonDeductibleBadges = page.locator('[data-testid="deductible-badge"][data-value="false"]')
      
      await expect(deductibleBadges).toHaveCount(await deductibleBadges.count())
      await expect(nonDeductibleBadges).toHaveCount(0)
    })

    test('should show validation status indicators', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions')
      
      // Verificar indicadores de estado de validación
      const validBadges = page.locator('[data-testid="validation-status"][data-status="valid"]')
      const invalidBadges = page.locator('[data-testid="validation-status"][data-status="invalid"]')
      const pendingBadges = page.locator('[data-testid="validation-status"][data-status="pending"]')
      
      // Debe haber al menos algunos indicadores visibles
      const totalBadges = await validBadges.count() + await invalidBadges.count() + await pendingBadges.count()
      expect(totalBadges).toBeGreaterThan(0)
    })
  })

  test.describe('Spanish Categories', () => {
    test('should show Spanish categories in form', async ({ page }) => {
      await page.goto('http://localhost:7331/transactions/new')
      
      const categorySelect = page.locator('[data-testid="category-select"]')
      await categorySelect.click()
      
      // Verificar categorías españolas específicas
      const spanishCategories = [
        'Suministros y Material',
        'Software y Suscripciones',
        'Telecomunicaciones',
        'Servicios Profesionales',
        'Dietas y Restauración'
      ]
      
      for (const category of spanishCategories) {
        await expect(page.locator(`text="${category}"`)).toBeVisible()
      }
    })

    test('should auto-categorize based on Spanish patterns', async ({ page }) => {
      // Este test requeriría datos de prueba específicos
      // y configuración del AI/LLM para testing
      
      await page.goto('http://localhost:7331/transactions/new')
      
      // Simular análisis de documento con patrón español
      await page.fill('[data-testid="merchant"]', 'Telefónica España SAU')
      await page.fill('[data-testid="description"]', 'Servicio telefonía móvil')
      
      // Debe sugerir categoría 'telecomunicaciones'
      const suggestedCategory = page.locator('[data-testid="suggested-category"]')
      await expect(suggestedCategory).toContainText('telecomunicaciones')
    })
  })

  test.describe('Dashboard with Spanish Analytics', () => {
    test('should show IVA and IRPF summaries', async ({ page }) => {
      await page.goto('http://localhost:7331/dashboard')
      
      // Verificar widgets fiscales específicos de España
      await expect(page.locator('[data-testid="iva-summary"]')).toBeVisible()
      await expect(page.locator('[data-testid="irpf-summary"]')).toBeVisible()
      await expect(page.locator('[data-testid="deductible-summary"]')).toBeVisible()
      
      // Verificar importes mostrados en euros
      const ivaAmount = page.locator('[data-testid="total-iva-amount"]')
      await expect(ivaAmount).toContainText('€')
    })

    test('should show validation health score', async ({ page }) => {
      await page.goto('http://localhost:7331/dashboard')
      
      const healthScore = page.locator('[data-testid="fiscal-health-score"]') 
      await expect(healthScore).toBeVisible()
      
      // Debe mostrar porcentaje
      await expect(healthScore).toContainText('%')
      
      // Verificar colores según puntuación
      const scoreValue = await healthScore.textContent()
      const percentage = parseInt(scoreValue?.replace('%', '') || '0')
      
      if (percentage >= 90) {
        await expect(healthScore).toHaveClass(/text-green-/)
      } else if (percentage >= 70) {
        await expect(healthScore).toHaveClass(/text-yellow-/)
      } else {
        await expect(healthScore).toHaveClass(/text-red-/)
      }
    })
  })
})