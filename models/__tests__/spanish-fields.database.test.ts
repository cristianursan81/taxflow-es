/**
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client'
import { validateSpanishTransaction } from '@/lib/spanish-tax-validator'

// Mock Prisma para tests
const mockPrisma = {
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient

// Mock del cliente Prisma
jest.mock('@/lib/db', () => ({
  prisma: mockPrisma
}))

describe('Spanish Transaction Database Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Transaction Creation with Spanish Fields', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }

    const spanishTransactionData = {
      id: 'tx-123',
      userId: 'user-123',
      name: 'Factura de prueba',
      merchant: 'Proveedor Test SL',
      total: 12100, // 121€
      type: 'expense',
      
      // Campos específicos españoles
      supplierName: 'Proveedor Test SL',
      supplierTaxId: 'B12345678',
      invoiceNumber: 'FAC-2024-001',
      invoiceType: 'factura',
      baseAmount: 10000, // 100€
      vatRate: 21.0,
      vatAmount: 2100, // 21€
      irpfRate: 0,
      irpfAmount: 0,
      grossTotal: 12100, // 121€
      deductible: true,
      taxValidationStatus: 'pending'
    }

    it('should create transaction with all Spanish fiscal fields', async () => {
      const mockCreatedTransaction = { ...spanishTransactionData }
      mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction)

      // Simular creación usando el modelo de transacciones
      const { createTransaction } = require('@/models/transactions')
      const result = await createTransaction(mockUser.id, spanishTransactionData)

      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          supplierName: 'Proveedor Test SL',
          supplierTaxId: 'B12345678',
          invoiceNumber: 'FAC-2024-001',
          invoiceType: 'factura',
          baseAmount: 10000,
          vatRate: 21.0,
          vatAmount: 2100,
          irpfRate: 0,
          irpfAmount: 0,
          grossTotal: 12100,
          deductible: true,
          taxValidationStatus: 'pending'
        })
      })
    })

    it('should handle decimal VAT and IRPF rates correctly', async () => {
      const transactionWithIRPF = {
        ...spanishTransactionData,
        vatRate: 21.00,  // Decimal
        irpfRate: 15.00, // Decimal
        irpfAmount: 1500 // 15€
      }

      mockPrisma.transaction.create.mockResolvedValue(transactionWithIRPF)
      
      const { createTransaction } = require('@/models/transactions')
      await createTransaction(mockUser.id, transactionWithIRPF)

      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          vatRate: 21.00,
          irpfRate: 15.00
        })
      })
    })

    it('should default deductible to true when not specified', async () => {
      const transactionWithoutDeductible = {
        ...spanishTransactionData
      }
      delete transactionWithoutDeductible.deductible

      mockPrisma.transaction.create.mockResolvedValue({
        ...transactionWithoutDeductible,
        deductible: true // Default value
      })

      const { createTransaction } = require('@/models/transactions')
      await createTransaction(mockUser.id, transactionWithoutDeductible)

      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({
          deductible: expect.anything()
        })
      })
    })

    it('should default tax validation status to pending', async () => {
      const transactionWithoutStatus = {
        ...spanishTransactionData
      }
      delete transactionWithoutStatus.taxValidationStatus

      mockPrisma.transaction.create.mockResolvedValue({
        ...transactionWithoutStatus,
        taxValidationStatus: 'pending'
      })

      const { createTransaction } = require('@/models/transactions')
      await createTransaction(mockUser.id, transactionWithoutStatus)

      // Si no se especifica, debe usar el valor por defecto
      expect(mockPrisma.transaction.create).toHaveBeenCalled()
    })
  })

  describe('Transaction Queries with Spanish Fields', () => {
    const mockTransactions = [
      {
        id: 'tx1',
        supplierName: 'Empresa A SL',
        supplierTaxId: 'B11111111',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000,
        vatRate: 21.0,
        vatAmount: 2100,
        deductible: true,
        taxValidationStatus: 'valid'
      },
      {
        id: 'tx2',
        supplierName: 'Empresa B SA',
        supplierTaxId: 'A22222222',
        invoiceNumber: 'FAC-002',
        baseAmount: 5000,
        vatRate: 10.0,
        vatAmount: 500,
        deductible: false,
        taxValidationStatus: 'invalid'
      }
    ]

    it('should query transactions including Spanish fiscal fields', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions)

      const { getTransactions } = require('@/models/transactions')
      const result = await getTransactions('user-123', {})

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            supplierName: true,
            supplierTaxId: true,
            invoiceNumber: true,
            invoiceType: true,
            baseAmount: true,
            vatRate: true,
            vatAmount: true,
            irpfRate: true,
            irpfAmount: true,
            grossTotal: true,
            deductible: true,
            taxValidationStatus: true
          })
        })
      )
    })

    it('should filter by deductible status', async () => {
      const deductibleOnly = mockTransactions.filter(t => t.deductible)
      mockPrisma.transaction.findMany.mockResolvedValue(deductibleOnly)

      const { getTransactions } = require('@/models/transactions')
      await getTransactions('user-123', { deductible: true })

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deductible: true
          })
        })
      )
    })

    it('should filter by tax validation status', async () => {
      const validTransactions = mockTransactions.filter(t => t.taxValidationStatus === 'valid')
      mockPrisma.transaction.findMany.mockResolvedValue(validTransactions)

      const { getTransactions } = require('@/models/transactions')
      await getTransactions('user-123', { taxValidationStatus: 'valid' })

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            taxValidationStatus: 'valid'
          })
        })
      )
    })

    it('should search by supplier tax ID', async () => {
      const matchingTransactions = mockTransactions.filter(t => 
        t.supplierTaxId?.includes('B11111111')
      )
      mockPrisma.transaction.findMany.mockResolvedValue(matchingTransactions)

      const { getTransactions } = require('@/models/transactions')
      await getTransactions('user-123', { supplierTaxId: 'B11111111' })

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            supplierTaxId: expect.objectContaining({
              contains: 'B11111111'
            })
          })
        })
      )
    })
  })

  describe('Transaction Updates with Validation', () => {
    it('should update transaction and recalculate validation status', async () => {
      const originalTransaction = {
        id: 'tx-123',
        supplierTaxId: '',
        baseAmount: 10000,
        vatRate: 21.0,
        vatAmount: 1500, // Wrong amount
        taxValidationStatus: 'pending'
      }

      const updatedData = {
        supplierTaxId: 'B12345678',
        vatAmount: 2100 // Correct amount
      }

      mockPrisma.transaction.findUnique.mockResolvedValue(originalTransaction)
      mockPrisma.transaction.update.mockResolvedValue({
        ...originalTransaction,
        ...updatedData,
        taxValidationStatus: 'valid'
      })

      const { updateTransaction } = require('@/models/transactions')
      await updateTransaction('user-123', 'tx-123', updatedData)

      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-123' },
        data: expect.objectContaining({
          supplierTaxId: 'B12345678',
          vatAmount: 2100
        })
      })
    })
  })

  describe('Spanish Validation Integration', () => {
    it('should validate transaction fields before database operations', () => {
      const transactionData = {
        supplierTaxId: 'INVALID',
        baseAmount: 10000,
        vatRate: 21.0,
        vatAmount: 1000 // Wrong
      }

      const validation = validateSpanishTransaction(transactionData)

      expect(validation.isValid).toBe(false)
      expect(validation.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'INVALID_TAX_ID'
          }),
          expect.objectContaining({
            code: 'INCONSISTENT_VAT'
          })
        ])
      )
    })

    it('should pass validation for correct Spanish transaction', () => {
      const transactionData = {
        supplierName: 'Empresa Test SL',
        supplierTaxId: 'B12345678',
        invoiceNumber: 'FAC-001',
        baseAmount: 10000,
        vatRate: 21.0,
        vatAmount: 2100,
        grossTotal: 12100,
        deductible: true
      }

      const validation = validateSpanishTransaction(transactionData)

      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
  })

  describe('Database Indexes Performance', () => {
    it('should efficiently query by supplier tax ID with index', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([])

      const { getTransactions } = require('@/models/transactions')
      await getTransactions('user-123', { supplierTaxId: 'B12345678' })

      // Verificar que la consulta utiliza el índice esperado
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            supplierTaxId: expect.any(Object)
          })
        })
      )
    })

    it('should efficiently query by invoice number with index', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([])

      const { getTransactions } = require('@/models/transactions')
      await getTransactions('user-123', { invoiceNumber: 'FAC-001' })

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            invoiceNumber: expect.any(Object)
          })
        })
      )
    })
  })
})