import { SpanishTaxValidator, validateSpanishTransaction } from '../spanish-tax-validator'

describe('SpanishTaxValidator', () => {
  describe('NIF/CIF Validation', () => {
    it('should accept valid NIF format', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        supplierName: 'Test Supplier',
        invoiceNumber: 'FAC-001',
        total: 12100 // 121€
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors.filter(e => e.code === 'INVALID_TAX_ID')).toHaveLength(0)
    })

    it('should accept valid CIF format', () => {
      const transaction = {
        supplierTaxId: 'B12345678',
        supplierName: 'Test Company SL',
        invoiceNumber: 'FAC-001',
        total: 12100
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors.filter(e => e.code === 'INVALID_TAX_ID')).toHaveLength(0)
    })

    it('should accept valid NIE format', () => {
      const transaction = {
        supplierTaxId: 'X1234567L',
        supplierName: 'Foreign Resident',
        invoiceNumber: 'FAC-001',
        total: 12100
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors.filter(e => e.code === 'INVALID_TAX_ID')).toHaveLength(0)
    })

    it('should reject invalid tax ID format', () => {
      const transaction = {
        supplierTaxId: 'INVALID123',
        supplierName: 'Test Supplier',
        invoiceNumber: 'FAC-001',
        total: 12100
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INVALID_TAX_ID',
          message: 'El NIF/CIF no tiene un formato válido',
          field: 'supplierTaxId',
          severity: 'error'
        })
      )
    })

    it('should require tax ID', () => {
      const transaction = {
        supplierName: 'Test Supplier',
        invoiceNumber: 'FAC-001',
        total: 12100
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_TAX_ID',
          message: 'Falta el NIF/CIF del proveedor',
          field: 'supplierTaxId',
          severity: 'error'
        })
      )
    })
  })

  describe('Invoice Number Validation', () => {
    it('should require invoice number for amounts over 400€', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        supplierName: 'Test Supplier',
        total: 50000 // 500€
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_INVOICE_NUMBER',
          message: 'Falta el número de factura (obligatorio para importes superiores a 400€)',
          field: 'invoiceNumber',
          severity: 'error'
        })
      )
    })

    it('should allow missing invoice number for small tickets under 400€', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        supplierName: 'Test Supplier',
        total: 3000 // 30€
      }

      const result = validateSpanishTransaction(transaction)
      const invoiceErrors = result.errors.filter(e => e.code.includes('INVOICE_NUMBER'))
      expect(invoiceErrors).toHaveLength(0)
      
      const invoiceWarnings = result.warnings.filter(w => w.code === 'MISSING_INVOICE_NUMBER_SMALL')
      expect(invoiceWarnings).toHaveLength(1)
    })
  })

  describe('VAT Validation', () => {
    it('should validate correct VAT calculation for 21%', () => {
      const baseAmount = 10000 // 100€
      const vatAmount = 2100 // 21€
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount,
        vatRate: 21,
        vatAmount,
        grossTotal: baseAmount + vatAmount
      }

      const result = validateSpanishTransaction(transaction)
      const vatErrors = result.errors.filter(e => e.code === 'INCONSISTENT_VAT')
      expect(vatErrors).toHaveLength(0)
    })

    it('should detect incorrect VAT calculation', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000, // 100€
        vatRate: 21,
        vatAmount: 1500, // Wrong: should be 21€, not 15€
        grossTotal: 11500
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INCONSISTENT_VAT',
          field: 'vatAmount',
          severity: 'error'
        })
      )
    })

    it('should warn about unusual VAT rates', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000,
        vatRate: 13, // Unusual rate
        vatAmount: 1300,
        grossTotal: 11300
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'UNUSUAL_VAT_RATE',
          field: 'vatRate'
        })
      )
    })

    it('should validate correct total calculation', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000, // 100€
        vatAmount: 2100,   // 21€
        grossTotal: 11000  // Wrong total: should be 121€
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INCONSISTENT_TOTAL',
          field: 'grossTotal',
          severity: 'error'
        })
      )
    })
  })

  describe('IRPF Validation', () => {
    it('should warn about missing IRPF for professional services', () => {
      const transaction = {
        supplierTaxId: '12345678Z', // Spanish supplier
        invoiceNumber: 'FAC-001',
        categoryCode: 'servicios_profesionales',
        baseAmount: 50000, // 500€
        vatRate: 21,
        vatAmount: 10500,
        irpfRate: 0 // Missing IRPF
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_IRPF',
          field: 'irpfRate'
        })
      )
    })

    it('should validate correct IRPF calculation', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000, // 100€
        irpfRate: 15,
        irpfAmount: 1400 // Wrong: should be 15€, not 14€
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'INCONSISTENT_IRPF',
          field: 'irpfAmount',
          severity: 'error'
        })
      )
    })
  })

  describe('Deductibility Validation', () => {
    it('should warn about questionable deductible categories', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        categoryCode: 'representacion',
        baseAmount: 15000, // 150€
        deductible: true
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'QUESTIONABLE_DEDUCTIBLE',
          field: 'deductible'
        })
      )
    })

    it('should warn about large expenses', () => {
      const transaction = {
        supplierTaxId: '12345678Z',
        invoiceNumber: 'FAC-001',
        baseAmount: 400000, // 4000€
        deductible: true
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'LARGE_EXPENSE',
          field: 'baseAmount'
        })
      )
    })

    it('should warn about large tickets without tax ID', () => {
      const transaction = {
        // No supplierTaxId
        invoiceNumber: 'TICKET-123',
        baseAmount: 45000, // 450€
        deductible: true
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: 'LARGE_TICKET_NO_TAX_ID',
          field: 'supplierTaxId'
        })
      )
    })
  })

  describe('Overall Validation', () => {
    it('should return valid for a perfect Spanish transaction', () => {
      const transaction = {
        supplierName: 'Empresa Test SL',
        supplierTaxId: 'B12345678',
        invoiceNumber: 'FAC-001-2024',
        invoiceType: 'factura',
        baseAmount: 10000, // 100€
        vatRate: 21,
        vatAmount: 2100, // 21€
        grossTotal: 12100, // 121€
        deductible: true,
        categoryCode: 'software_suscripciones'
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for transactions with errors', () => {
      const transaction = {
        supplierName: 'Test',
        // Missing supplierTaxId (error)
        invoiceNumber: 'FAC-001',
        baseAmount: 10000,
        vatRate: 21,
        vatAmount: 1000 // Wrong VAT amount (error)
      }

      const result = validateSpanishTransaction(transaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})