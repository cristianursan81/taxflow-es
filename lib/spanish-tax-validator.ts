// Validador fiscal para España
export interface SpanishTaxValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  code: string
  message: string
  field?: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  code: string
  message: string
  field?: string
  suggestion?: string
}

export interface TransactionData {
  supplierName?: string
  supplierTaxId?: string
  invoiceNumber?: string
  invoiceType?: string
  baseAmount?: number
  vatRate?: number
  vatAmount?: number
  irpfRate?: number
  irpfAmount?: number
  grossTotal?: number
  total?: number
  merchant?: string
  categoryCode?: string
  deductible?: boolean
}

// Expresiones regulares para validación española
const NIF_REGEX = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i
const CIF_REGEX = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/i
const NIE_REGEX = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i

// Tipos de IVA estándar en España
const STANDARD_VAT_RATES = [0, 4, 10, 21]

// Categorías que típicamente requieren IRPF
const IRPF_CATEGORIES = [
  'servicios_profesionales',
  'alquiler',
  'formacion'
]

// Categorías que pueden no ser deducibles
const QUESTIONABLE_DEDUCTIBLE_CATEGORIES = [
  'representacion',
  'dietas_restauracion'
]

export class SpanishTaxValidator {
  
  static validateTransaction(data: TransactionData): SpanishTaxValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Validación 1: NIF/CIF obligatorio
    if (!data.supplierTaxId || data.supplierTaxId.trim() === '') {
      errors.push({
        code: 'MISSING_TAX_ID',
        message: 'Falta el NIF/CIF del proveedor',
        field: 'supplierTaxId',
        severity: 'error'
      })
    } else if (!this.isValidSpanishTaxId(data.supplierTaxId)) {
      errors.push({
        code: 'INVALID_TAX_ID',
        message: 'El NIF/CIF no tiene un formato válido',
        field: 'supplierTaxId',
        severity: 'error'
      })
    }

    // Validación 2: Número de factura obligatorio (excepto para tickets pequeños)
    if (!data.invoiceNumber || data.invoiceNumber.trim() === '') {
      const isSmallTicket = (data.grossTotal || data.total || 0) < 40000 // 400€
      if (isSmallTicket) {
        warnings.push({
          code: 'MISSING_INVOICE_NUMBER_SMALL',
          message: 'Ticket sin número de factura (permitido para importes menores a 400€)',
          field: 'invoiceNumber',
          suggestion: 'Considera solicitar factura para mayor control contable'
        })
      } else {
        errors.push({
          code: 'MISSING_INVOICE_NUMBER',
          message: 'Falta el número de factura (obligatorio para importes superiores a 400€)',
          field: 'invoiceNumber',
          severity: 'error'
        })
      }
    }

    // Validación 3: IVA coherente
    this.validateVAT(data, errors, warnings)

    // Validación 4: IRPF esperado pero ausente
    this.validateIRPF(data, errors, warnings)

    // Validación 5: Deducibilidad cuestionable
    this.validateDeductibility(data, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private static isValidSpanishTaxId(taxId: string): boolean {
    const cleanId = taxId.toUpperCase().trim()
    return NIF_REGEX.test(cleanId) || CIF_REGEX.test(cleanId) || NIE_REGEX.test(cleanId)
  }

  private static validateVAT(data: TransactionData, errors: ValidationError[], warnings: ValidationWarning[]) {
    const baseAmount = data.baseAmount || 0
    const vatRate = data.vatRate || 0
    const vatAmount = data.vatAmount || 0
    const grossTotal = data.grossTotal || data.total || 0

    // Verificar tipo de IVA estándar
    if (vatRate > 0 && !STANDARD_VAT_RATES.includes(vatRate)) {
      warnings.push({
        code: 'UNUSUAL_VAT_RATE',
        message: `Tipo de IVA inusual (${vatRate}%). Verificar si es correcto.`,
        field: 'vatRate',
        suggestion: 'Los tipos estándar son: 21% (general), 10% (reducido), 4% (superreducido)'
      })
    }

    // Verificar cálculo de IVA
    if (baseAmount > 0 && vatRate > 0) {
      const expectedVatAmount = Math.round((baseAmount * vatRate) / 100)
      const tolerance = Math.max(1, Math.round(expectedVatAmount * 0.02)) // 2% de tolerancia o mínimo 1 céntimo

      if (Math.abs(vatAmount - expectedVatAmount) > tolerance) {
        errors.push({
          code: 'INCONSISTENT_VAT',
          message: `IVA incoherente. Esperado: ${(expectedVatAmount / 100).toFixed(2)}€, encontrado: ${(vatAmount / 100).toFixed(2)}€`,
          field: 'vatAmount',
          severity: 'error'
        })
      }
    }

    // Verificar total bruto
    if (baseAmount > 0 && vatAmount >= 0) {
      const expectedGrossTotal = baseAmount + vatAmount
      const tolerance = Math.max(1, Math.round(expectedGrossTotal * 0.02))

      if (grossTotal > 0 && Math.abs(grossTotal - expectedGrossTotal) > tolerance) {
        errors.push({
          code: 'INCONSISTENT_TOTAL',
          message: `Total incoherente. Base + IVA = ${(expectedGrossTotal / 100).toFixed(2)}€, pero el total es ${(grossTotal / 100).toFixed(2)}€`,
          field: 'grossTotal',
          severity: 'error'
        })
      }
    }
  }

  private static validateIRPF(data: TransactionData, errors: ValidationError[], warnings: ValidationWarning[]) {
    const categoryCode = data.categoryCode || ''
    const supplierTaxId = data.supplierTaxId || ''
    const irpfRate = data.irpfRate || 0
    const irpfAmount = data.irpfAmount || 0
    const baseAmount = data.baseAmount || data.total || 0

    // Verificar si la categoría típicamente requiere IRPF
    const requiresIRPF = IRPF_CATEGORIES.includes(categoryCode)
    
    // Verificar si es un proveedor nacional (NIF/CIF español)
    const isNationalSupplier = this.isValidSpanishTaxId(supplierTaxId)

    if (requiresIRPF && isNationalSupplier && irpfRate === 0 && baseAmount > 30000) { // > 300€
      warnings.push({
        code: 'MISSING_IRPF',
        message: `Se esperaba retención IRPF para servicios profesionales de proveedores nacionales`,
        field: 'irpfRate',
        suggestion: 'Verificar si aplica retención del 15% o 7% según el caso'
      })
    }

    // Verificar cálculo de IRPF
    if (baseAmount > 0 && irpfRate > 0) {
      const expectedIrpfAmount = Math.round((baseAmount * irpfRate) / 100)
      const tolerance = Math.max(1, Math.round(expectedIrpfAmount * 0.02))

      if (Math.abs(irpfAmount - expectedIrpfAmount) > tolerance) {
        errors.push({
          code: 'INCONSISTENT_IRPF',
          message: `IRPF incoherente. Esperado: ${(expectedIrpfAmount / 100).toFixed(2)}€, encontrado: ${(irpfAmount / 100).toFixed(2)}€`,
          field: 'irpfAmount',
          severity: 'error'
        })
      }
    }
  }

  private static validateDeductibility(data: TransactionData, warnings: ValidationWarning[]) {
    const categoryCode = data.categoryCode || ''
    const deductible = data.deductible
    const baseAmount = data.baseAmount || data.total || 0

    // Verificar categorías cuestionables
    if (QUESTIONABLE_DEDUCTIBLE_CATEGORIES.includes(categoryCode)) {
      if (deductible === true) {
        warnings.push({
          code: 'QUESTIONABLE_DEDUCTIBLE',
          message: `Gasto marcado como deducible pero la categoría '${categoryCode}' requiere justificación`,
          field: 'deductible',
          suggestion: 'Asegúrese de que cumple los requisitos de deducibilidad y conserve la documentación justificativa'
        })
      }
    }

    // Alertar sobre gastos grandes sin justificación
    if (baseAmount > 300000 && deductible === true) { // > 3000€
      warnings.push({
        code: 'LARGE_EXPENSE',
        message: `Gasto elevado (${(baseAmount / 100).toFixed(2)}€). Verificar documentación`,
        field: 'baseAmount',
        suggestion: 'Conservar factura original y justificación del gasto empresarial'
      })
    }

    // Tickets sin NIF para gastos altos
    if (!data.supplierTaxId && baseAmount > 40000 && deductible === true) { // > 400€
      warnings.push({
        code: 'LARGE_TICKET_NO_TAX_ID',
        message: `Ticket sin NIF/CIF para importe superior a 400€. Deducibilidad limitada.`,
        field: 'supplierTaxId',
        suggestion: 'Solicitar factura con datos fiscales para gastos superiores a 400€'
      })
    }
  }
}

// Función helper para uso en el frontend
export function validateSpanishTransaction(data: TransactionData) {
  return SpanishTaxValidator.validateTransaction(data)
}