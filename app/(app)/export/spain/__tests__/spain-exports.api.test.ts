/**
 * @jest-environment node
 */

import { GET as libroGastosHandler } from '../libro-gastos/route'
import { GET as libroIngresosHandler } from '../libro-ingresos/route' 
import { GET as modelo303Handler } from '../modelo-303/route'
import { GET as modelo130Handler } from '../modelo-130/route'

// Mock de autenticación
jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({ id: 'test-user-id' }))
}))

// Mock de transacciones
const mockTransactions = [
  {
    id: 'tx1',
    issuedAt: new Date('2024-01-15'),
    supplierName: 'Proveedor Test SL',
    supplierTaxId: 'B12345678',
    invoiceNumber: 'FAC-001',
    description: 'Servicios de desarrollo',
    baseAmount: 10000, // 100€
    vatRate: 21,
    vatAmount: 2100, // 21€
    grossTotal: 12100, // 121€
    total: 12100,
    deductible: true,
    categoryCode: 'software_suscripciones',
    type: 'expense'
  },
  {
    id: 'tx2',
    issuedAt: new Date('2024-02-01'),
    supplierName: 'Cliente Test SA',
    supplierTaxId: 'A87654321',
    invoiceNumber: 'FAC-002',
    description: 'Servicios profesionales',
    baseAmount: 50000, // 500€
    vatRate: 21,
    vatAmount: 10500, // 105€
    irpfAmount: 7500, // 75€ (15%)
    grossTotal: 60500,
    total: 60500,
    categoryCode: 'servicios_profesionales',
    type: 'income'
  }
]

jest.mock('@/models/transactions', () => ({
  getTransactions: jest.fn(() => Promise.resolve({ 
    transactions: mockTransactions.filter(tx => 
      tx.type === (process.env.TEST_TRANSACTION_TYPE || 'expense')
    )
  }))
}))

describe('Spanish Export API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Libro de Gastos Export', () => {
    beforeAll(() => {
      process.env.TEST_TRANSACTION_TYPE = 'expense'
    })

    it('should export gastos in CSV format', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-gastos?year=2024')
      const request = new Request(url)

      const response = await libroGastosHandler(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/csv')
      expect(response.headers.get('Content-Disposition')).toContain('libro-gastos-2024.csv')
    })

    it('should include correct headers in CSV', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-gastos?year=2024')
      const request = new Request(url)

      const response = await libroGastosHandler(request)
      const csvText = await response.text()

      const expectedHeaders = [
        'Fecha', 'Proveedor', 'NIF/CIF', 'Nº Factura', 'Concepto',
        'Base Imponible', 'Tipo IVA (%)', 'Cuota IVA', 'Tipo IRPF (%)',
        'Cuota IRPF', 'Total', 'Deducible', 'Categoría'
      ]

      expectedHeaders.forEach(header => {
        expect(csvText).toContain(header)
      })
    })

    it('should format amounts correctly', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-gastos?year=2024')
      const request = new Request(url)

      const response = await libroGastosHandler(request)
      const csvText = await response.text()

      // Verificar que los importes se formatean correctamente (centimos a euros)
      expect(csvText).toContain('100.00') // Base amount
      expect(csvText).toContain('21.00')  // VAT amount
      expect(csvText).toContain('121.00') // Total
    })
  })

  describe('Libro de Ingresos Export', () => {
    beforeAll(() => {
      process.env.TEST_TRANSACTION_TYPE = 'income'
    })

    it('should export ingresos in CSV format', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-ingresos?year=2024')
      const request = new Request(url)

      const response = await libroIngresosHandler(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toContain('text/csv')
      expect(response.headers.get('Content-Disposition')).toContain('libro-ingresos-2024.csv')
    })
  })

  describe('Modelo 303 Export', () => {
    it('should export modelo 303 in JSON format', async () => {
      const url = new URL('http://localhost:3000/export/spain/modelo-303?year=2024&quarter=1')
      const request = new Request(url)

      const response = await modelo303Handler(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Disposition')).toContain('modelo-303-2024-T1.json')
    })

    it('should calculate IVA correctly', async () => {
      const url = new URL('http://localhost:3000/export/spain/modelo-303?year=2024&quarter=1')
      const request = new Request(url)

      const response = await modelo303Handler(request)
      const jsonData = await response.json()

      expect(jsonData).toHaveProperty('ejercicio', 2024)
      expect(jsonData).toHaveProperty('periodo', '01')
      expect(jsonData).toHaveProperty('ivaRepercutido')
      expect(jsonData).toHaveProperty('ivaSoportado')
      expect(jsonData).toHaveProperty('diferenciaIva')
    })
  })

  describe('Modelo 130 Export', () => {
    it('should export modelo 130 in JSON format', async () => {
      const url = new URL('http://localhost:3000/export/spain/modelo-130?year=2024&quarter=1')
      const request = new Request(url)

      const response = await modelo130Handler(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Disposition')).toContain('modelo-130-2024-T1.json')
    })

    it('should calculate IRPF fractions correctly', async () => {
      const url = new URL('http://localhost:3000/export/spain/modelo-130?year=2024&quarter=1')
      const request = new Request(url)

      const response = await modelo130Handler(request)
      const jsonData = await response.json()

      expect(jsonData).toHaveProperty('ejercicio', 2024)
      expect(jsonData).toHaveProperty('periodo', '01')
      expect(jsonData).toHaveProperty('ingresos')
      expect(jsonData).toHaveProperty('gastosDeducibles')
      expect(jsonData).toHaveProperty('baseImponible')
      expect(jsonData).toHaveProperty('pagoFraccionado')
      expect(jsonData).toHaveProperty('retenciones')
      expect(jsonData).toHaveProperty('liquidoIngresar')
    })

    it('should include observaciones for estimation disclaimer', async () => {
      const url = new URL('http://localhost:3000/export/spain/modelo-130?year=2024&quarter=1')
      const request = new Request(url)

      const response = await modelo130Handler(request)
      const jsonData = await response.json()

      expect(jsonData.observaciones).toContain('Cálculo estimativo')
      expect(jsonData.observaciones).toContain('asesor fiscal')
    })
  })

  describe('Date Filtering', () => {
    it('should filter transactions by year', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-gastos?year=2023')
      const request = new Request(url)

      // Mock para simular transacciones de 2023
      const { getTransactions } = require('@/models/transactions')
      getTransactions.mockImplementationOnce(() => Promise.resolve({
        transactions: []
      }))

      const response = await libroGastosHandler(request)
      expect(response.status).toBe(200)

      expect(getTransactions).toHaveBeenCalledWith(
        'test-user-id',
        expect.objectContaining({
          fromDate: '2023-01-01',
          toDate: '2023-12-31',
          type: 'expense'
        })
      )
    })

    it('should handle custom date ranges', async () => {
      const url = new URL('http://localhost:3000/export/spain/libro-gastos?fromDate=2024-01-01&toDate=2024-03-31')
      const request = new Request(url)

      const response = await libroGastosHandler(request)
      expect(response.status).toBe(200)
    })
  })

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      // Mock authentication failure
      const { getCurrentUser } = require('@/lib/auth')
      getCurrentUser.mockRejectedValueOnce(new Error('Unauthorized'))

      const url = new URL('http://localhost:3000/export/spain/libro-gastos?year=2024')
      const request = new Request(url)

      await expect(libroGastosHandler(request)).rejects.toThrow('Unauthorized')
    })
  })
})