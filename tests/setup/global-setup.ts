import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

async function globalSetup() {
  console.log('🚀 Configurando entorno de testing...')

  // Configurar variables de entorno para testing
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/taxflow-es-test'
  process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing'

  try {
    // Verificar si la base de datos de test está disponible
    console.log('📊 Configurando base de datos de testing...')
    
    // Ejecutar migraciones en la base de datos de test
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      },
      stdio: 'inherit'
    })

    // Crear cliente de Prisma para datos de prueba
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })

    // Limpiar datos existentes
    await prisma.transaction.deleteMany()
    await prisma.category.deleteMany()
    await prisma.project.deleteMany()
    await prisma.field.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Base de datos limpiada')

    // Crear usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        id: 'test-user-123',
        email: 'test@taxflow-es.com',
        name: 'Usuario de Prueba',
        businessName: 'TaxFlow Testing SL',
        businessAddress: 'Calle Test 123, Madrid',
        emailVerified: true
      }
    })

    console.log('👤 Usuario de prueba creado:', testUser.email)

    // Crear categorías españolas de prueba
    const spanishCategories = [
      {
        code: 'suministros',
        name: 'Suministros y Material',
        color: '#c69713',
        userId: testUser.id
      },
      {
        code: 'software_suscripciones',
        name: 'Software y Suscripciones',
        color: '#8753fb',
        userId: testUser.id
      },
      {
        code: 'telecomunicaciones',
        name: 'Telecomunicaciones',
        color: '#0e7d86',
        userId: testUser.id
      },
      {
        code: 'servicios_profesionales',
        name: 'Servicios Profesionales',
        color: '#064e85',
        userId: testUser.id
      }
    ]

    await prisma.category.createMany({
      data: spanishCategories
    })

    // Crear proyecto de prueba
    await prisma.project.create({
      data: {
        code: 'personal',
        name: 'Personal',
        color: '#1e202b',
        userId: testUser.id
      }
    })

    // Crear campos fiscales españoles
    const spanishFields = [
      {
        code: 'supplierName',
        name: 'Proveedor',
        type: 'string',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'supplierTaxId',
        name: 'NIF/CIF',
        type: 'string',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'invoiceNumber',
        name: 'Nº Factura',
        type: 'string',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'baseAmount',
        name: 'Base Imponible',
        type: 'number',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'vatRate',
        name: 'Tipo IVA (%)',
        type: 'number',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'vatAmount',
        name: 'Cuota IVA',
        type: 'number',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      },
      {
        code: 'deductible',
        name: 'Deducible',
        type: 'boolean',
        userId: testUser.id,
        isExtra: false,
        isVisibleInList: true
      }
    ]

    await prisma.field.createMany({
      data: spanishFields
    })

    // Crear transacciones de prueba con campos fiscales españoles
    const testTransactions = [
      // Gasto válido
      {
        id: 'tx-valid-expense',
        userId: testUser.id,
        name: 'Factura Software',
        merchant: 'Software Company SL',
        total: 12100, // 121€
        type: 'expense',
        categoryCode: 'software_suscripciones',
        projectCode: 'personal',
        issuedAt: new Date('2024-01-15'),
        supplierName: 'Software Company SL',
        supplierTaxId: 'B12345678',
        invoiceNumber: 'FAC-2024-001',
        invoiceType: 'factura',
        baseAmount: 10000, // 100€
        vatRate: 21.0,
        vatAmount: 2100, // 21€
        grossTotal: 12100,
        deductible: true,
        taxValidationStatus: 'valid'
      },
      // Gasto con errores de validación
      {
        id: 'tx-invalid-expense',
        userId: testUser.id,
        name: 'Factura con errores',
        merchant: 'Proveedor Sin NIF',
        total: 50000, // 500€
        type: 'expense',
        categoryCode: 'servicios_profesionales',
        projectCode: 'personal',
        issuedAt: new Date('2024-02-01'),
        supplierName: 'Proveedor Sin NIF',
        // supplierTaxId falta (error)
        // invoiceNumber falta (error para >400€)
        baseAmount: 41322, // Base inconsistente
        vatRate: 21.0,
        vatAmount: 8678, // IVA incorrecto
        grossTotal: 50000,
        deductible: true,
        taxValidationStatus: 'invalid'
      },
      // Ingreso con IRPF
      {
        id: 'tx-income-irpf',
        userId: testUser.id,
        name: 'Servicios Profesionales',
        merchant: 'Cliente ABC SA',
        total: 53000, // 530€
        type: 'income',
        categoryCode: 'servicios_profesionales',
        projectCode: 'personal',
        issuedAt: new Date('2024-01-20'),
        supplierName: 'Cliente ABC SA',
        supplierTaxId: 'A87654321',
        invoiceNumber: 'FAC-OUT-001',
        invoiceType: 'factura',
        baseAmount: 50000, // 500€
        vatRate: 21.0,
        vatAmount: 10500, // 105€
        irpfRate: 15.0,
        irpfAmount: 7500, // 75€ (retenido)
        grossTotal: 60500,
        deductible: true,
        taxValidationStatus: 'valid'
      },
      // Ticket pequeño sin factura
      {
        id: 'tx-small-ticket',
        userId: testUser.id,
        name: 'Suministros oficina',
        merchant: 'Papelería López',
        total: 2500, // 25€
        type: 'expense',
        categoryCode: 'suministros',
        projectCode: 'personal',
        issuedAt: new Date('2024-01-10'),
        supplierName: 'Papelería López',
        supplierTaxId: '12345678Z',
        // Sin número de factura (permitido para <400€)
        baseAmount: 2066,
        vatRate: 21.0,
        vatAmount: 434,
        grossTotal: 2500,
        deductible: true,
        taxValidationStatus: 'valid'
      }
    ]

    for (const transaction of testTransactions) {
      await prisma.transaction.create({
        data: transaction
      })
    }

    console.log(`📝 ${testTransactions.length} transacciones de prueba creadas`)
    console.log('✅ Configuración de testing completada')

    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Error configurando entorno de testing:', error)
    throw error
  }
}

export default globalSetup