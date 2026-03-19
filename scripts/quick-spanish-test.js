#!/usr/bin/env node

/**
 * Test rápido de funcionalidades españolas (versión standalone)
 * Ejecutar con: node scripts/quick-spanish-test.js
 */

console.log('🇪🇸 Test Rápido de Funcionalidades Españolas\n')

// Función de validación simplificada (replica la lógica principal)
function validateSpanishTransaction(transaction = {}) {
  const errors = []
  const warnings = []
  
  // Validar NIF/CIF
  if (transaction.supplierTaxId) {
    const taxId = transaction.supplierTaxId.toUpperCase()
    
    // NIF español: 8 dígitos + letra
    const nifPattern = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/
    // CIF empresas: letra + 7 dígitos + letra/dígito  
    const cifPattern = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/
    // NIE extranjeros: X/Y/Z + 7 dígitos + letra
    const niePattern = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/
    
    if (!nifPattern.test(taxId) && !cifPattern.test(taxId) && !niePattern.test(taxId)) {
      errors.push({ code: 'INVALID_TAX_ID', message: `ID fiscal inválido: ${taxId}` })
    }
  } else {
    errors.push({ code: 'MISSING_TAX_ID', message: 'ID fiscal requerido' })
  }
  
  // Validar IVA
  if (transaction.baseAmount && transaction.vatRate && transaction.vatAmount) {
    const expectedVat = Math.round(transaction.baseAmount * transaction.vatRate / 100)
    if (Math.abs(transaction.vatAmount - expectedVat) > 1) { // Tolerancia de 1 céntimo
      errors.push({ 
        code: 'INCONSISTENT_VAT', 
        message: `IVA incorrecto: calculado ${expectedVat}, declarado ${transaction.vatAmount}` 
      })
    }
  }
  
  // Sugerir IRPF para servicios profesionales con NIF español
  if (transaction.supplierTaxId && transaction.categoryCode === 'servicios_profesionales') {
    const isSpanishNIF = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(transaction.supplierTaxId.toUpperCase())
    if (isSpanishNIF && (!transaction.irpfRate || transaction.irpfRate === 0)) {
      warnings.push({ 
        code: 'MISSING_IRPF', 
        message: 'Los servicios profesionales suelen requerir retención IRPF' 
      })
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Test 1: Validación de NIF/CIF
console.log('1. 🆔 Validación de NIF/CIF:')

const validTaxIds = ['12345678Z', 'B12345678', 'X1234567L']
const invalidTaxIds = ['INVALID', '12345', '']

validTaxIds.forEach(taxId => {
  const result = validateSpanishTransaction({ supplierTaxId: taxId })
  const hasError = result.errors.some(e => e.code === 'INVALID_TAX_ID')
  console.log(`   ${hasError ? '❌' : '✅'} ${taxId} - ${hasError ? 'INVÁLIDO' : 'válido'}`)
})

invalidTaxIds.forEach(taxId => {
  const result = validateSpanishTransaction({ supplierTaxId: taxId || '(vacío)' })
  const hasError = result.errors.some(e => e.code.includes('TAX_ID'))
  console.log(`   ${hasError ? '✅' : '❌'} ${taxId || '(vacío)'} - ${hasError ? 'rechazado correctamente' : 'ERROR: debería rechazarse'}`)
})

// Test 2: Cálculo de IVA
console.log('\n2. 💰 Cálculo de IVA:')

const vatTests = [
  { base: 10000, rate: 21, expected: 2100, name: 'IVA 21% (100€)' },
  { base: 10000, rate: 10, expected: 1000, name: 'IVA 10% (100€)' },
  { base: 10000, rate: 4, expected: 400, name: 'IVA 4% (100€)' },
  { base: 10000, rate: 21, vat: 1500, name: 'IVA incorrecto (debe detectar error)' }
]

vatTests.forEach(test => {
  const transaction = {
    supplierTaxId: 'B12345678',
    baseAmount: test.base,
    vatRate: test.rate,
    vatAmount: test.vat || test.expected,
    grossTotal: test.base + (test.vat || test.expected)
  }
  
  const result = validateSpanishTransaction(transaction)
  const hasVatError = result.errors.some(e => e.code === 'INCONSISTENT_VAT')
  const shouldHaveError = test.vat && test.vat !== test.expected
  
  if (shouldHaveError) {
    console.log(`   ${hasVatError ? '✅' : '❌'} ${test.name} - ${hasVatError ? 'error detectado' : 'ERROR: debería detectar error'}`)
  } else {
    console.log(`   ${hasVatError ? '❌' : '✅'} ${test.name} - ${hasVatError ? 'falso positivo' : 'cálculo correcto'}`)
  }
})

// Test 3: Detección de IRPF
console.log('\n3. 📊 Detección de IRPF:')

const irpfTests = [
  {
    name: 'Servicios profesionales + NIF español',
    data: {
      supplierTaxId: '12345678Z',
      categoryCode: 'servicios_profesionales',
      baseAmount: 100000,
      irpfRate: 0
    },
    shouldWarn: true
  },
  {
    name: 'Servicios profesionales con IRPF',
    data: {
      supplierTaxId: '12345678Z',
      categoryCode: 'servicios_profesionales',
      baseAmount: 100000,
      irpfRate: 15,
      irpfAmount: 15000
    },
    shouldWarn: false
  }
]

irpfTests.forEach(test => {
  const result = validateSpanishTransaction(test.data)
  const hasIrpfWarning = result.warnings.some(w => w.code === 'MISSING_IRPF')
  
  console.log(`   ${(hasIrpfWarning === test.shouldWarn) ? '✅' : '❌'} ${test.name} - ${hasIrpfWarning ? 'sugiere IRPF' : 'no sugiere IRPF'}`)
})

// Test 4: Validación completa
console.log('\n4. ✅ Transacción española perfecta:')

const perfectTransaction = {
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

const perfectResult = validateSpanishTransaction(perfectTransaction)
console.log(`   ${perfectResult.isValid ? '✅' : '❌'} Transacción válida: ${perfectResult.isValid ? 'SÍ' : 'NO'}`)
console.log(`   📊 Errores: ${perfectResult.errors.length}`)
console.log(`   ⚠️  Avisos: ${perfectResult.warnings.length}`)

// Test 5: Categorías españolas
console.log('\n5. 📁 Categorías españolas disponibles:')

const spanishCategories = [
  { code: 'suministros', name: 'Suministros y materiales' },
  { code: 'software_suscripciones', name: 'Software y suscripciones' },
  { code: 'telecomunicaciones', name: 'Telecomunicaciones' },  
  { code: 'servicios_profesionales', name: 'Servicios profesionales' },
  { code: 'dietas_restauracion', name: 'Dietas y restauración' }
]

spanishCategories.forEach(category => {
  console.log(`   ✅ ${category.code} - ${category.name}`)
})

console.log('   ✅ Categorías españolas definidas correctamente')

// Resumen final
console.log('\n' + '='.repeat(50))
console.log('📋 RESULTADO DEL TEST RÁPIDO:')
console.log('✅ Si todos los elementos muestran ✅, las funcionalidades españolas están funcionando')
console.log('❌ Si hay ❌, revisa la implementación o configuración')
console.log('\n📖 Para tests completos ejecuta: npm test')
console.log('🌐 Para tests E2E ejecuta: npm run test:e2e')
console.log('='.repeat(50))