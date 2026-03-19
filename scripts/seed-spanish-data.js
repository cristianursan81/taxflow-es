#!/usr/bin/env node

/**
 * Poblar base de datos con datos iniciales españoles
 * Ejecutar con: node scripts/seed-spanish-data.js
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🇪🇸 Poblando base de datos con datos españoles...')

  // Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'demo@taxflow-es.com' },
    update: {},
    create: {
      email: 'demo@taxflow-es.com',
      name: 'Usuario Demo TaxFlow ES',
      businessName: 'Mi Empresa SL',
      businessAddress: 'Calle Mayor 123, 28001 Madrid',
      emailVerified: true,
    },
  })

  console.log('✅ Usuario demo creado:', user.email)

  // Crear categorías españolas
  const spanishCategories = [
    { code: 'suministros', name: 'Suministros y materiales' },
    { code: 'software_suscripciones', name: 'Software y suscripciones' },
    { code: 'telecomunicaciones', name: 'Telecomunicaciones' },
    { code: 'servicios_profesionales', name: 'Servicios profesionales' },
    { code: 'dietas_restauracion', name: 'Dietas y restauración' },
    { code: 'vehiculos_combustible', name: 'Vehículos y combustible' },
    { code: 'formacion', name: 'Formación y capacitación' },
    { code: 'marketing', name: 'Marketing y publicidad' },
    { code: 'seguros', name: 'Seguros' },
    { code: 'servicios_bancarios', name: 'Servicios bancarios' },
    { code: 'alquileres', name: 'Alquileres' },
    { code: 'suministros_oficina', name: 'Suministros de oficina' },
    { code: 'reparaciones', name: 'Reparaciones y mantenimiento' },
    { code: 'juridicos_asesoria', name: 'Servicios jurídicos y asesoría' },
    { code: 'impuestos_tasas', name: 'Impuestos y tasas' },
    { code: 'gastos_representacion', name: 'Gastos de representación' },
  ]

  for (const category of spanishCategories) {
    await prisma.category.upsert({
      where: { 
        userId_code: {
          userId: user.id,
          code: category.code
        }
      },
      update: {},
      create: {
        userId: user.id,
        code: category.code,
        name: category.name,
        color: '#3b82f6', // Azul por defecto
      },
    })
  }

  console.log('✅ Categorías españolas creadas:', spanishCategories.length)

  // Crear moneda EUR
  await prisma.currency.upsert({
    where: {
      userId_code: {
        userId: user.id,
        code: 'EUR'
      }
    },
    update: {},
    create: {
      userId: user.id,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      rate: 1.0,
    },
  })

  console.log('✅ Moneda EUR creada')

  // Crear transacciones de ejemplo españolas
  const sampleTransactions = [
    {
      supplierName: 'Consultoría Digital SL',
      supplierTaxId: 'B87654321',
      invoiceNumber: 'CONS-2024-001',
      invoiceType: 'factura',
      description: 'Desarrollo web personalizado',
      categoryCode: 'servicios_profesionales',
      baseAmount: 150000, // 1500€
      vatRate: 21.0,
      vatAmount: 31500, // 315€
      grossTotal: 181500, // 1815€
      deductible: true,
      date: new Date('2024-01-15'),
    },
    {
      supplierName: 'Software Solutions España',
      supplierTaxId: 'B12345678',
      invoiceNumber: 'SW-001-2024',
      invoiceType: 'factura',
      description: 'Licencia anual software contable',
      categoryCode: 'software_suscripciones',
      baseAmount: 60000, // 600€
      vatRate: 21.0,
      vatAmount: 12600, // 126€
      grossTotal: 72600, // 726€
      deductible: true,
      date: new Date('2024-01-20'),
    },
    {
      supplierName: 'María González López',
      supplierTaxId: '12345678Z',
      invoiceNumber: 'MGF-003',
      invoiceType: 'factura',
      description: 'Asesoría fiscal trimestral',
      categoryCode: 'juridicos_asesoria',
      baseAmount: 80000, // 800€
      vatRate: 21.0,
      vatAmount: 16800, // 168€
      irpfRate: 15.0,
      irpfAmount: -12000, // -120€ (retención)
      grossTotal: 84800, // 848€
      deductible: true,
      date: new Date('2024-02-01'),
    },
  ]

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: transaction.grossTotal,
        originalAmount: transaction.baseAmount,
        originalCurrency: 'EUR',
        currency: 'EUR',
        rate: 1.0,
        status: 'done',
        supplierName: transaction.supplierName,
        supplierTaxId: transaction.supplierTaxId,
        invoiceNumber: transaction.invoiceNumber,
        invoiceType: transaction.invoiceType,
        description: transaction.description,
        categoryCode: transaction.categoryCode,
        baseAmount: transaction.baseAmount,
        vatRate: transaction.vatRate,
        vatAmount: transaction.vatAmount,
        irpfRate: transaction.irpfRate || null,
        irpfAmount: transaction.irpfAmount || null,
        grossTotal: transaction.grossTotal,
        deductible: transaction.deductible,
        createdAt: transaction.date,
        updatedAt: transaction.date,
      },
    })
  }

  console.log('✅ Transacciones de ejemplo creadas:', sampleTransactions.length)

  console.log('\n🎉 Base de datos poblada con datos españoles!')
  console.log('📧 Usuario demo: demo@taxflow-es.com')
  console.log('📊 Datos incluidos:')
  console.log('   • 16 categorías fiscales españolas')
  console.log('   • Moneda EUR configurada')
  console.log('   • 3 transacciones de ejemplo con IVA/IRPF')
  console.log('\n🚀 Ya puedes arrancar la app con: npm run dev')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })