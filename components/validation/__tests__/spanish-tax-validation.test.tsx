import { render, screen } from '@testing-library/react'
import { ValidationDisplay, ValidationSummary } from '../spanish-tax-validation'
import type { SpanishTaxValidationResult } from '@/lib/spanish-tax-validator'

describe('ValidationDisplay', () => {
  const mockValidationWithErrors: SpanishTaxValidationResult = {
    isValid: false,
    errors: [
      {
        code: 'MISSING_TAX_ID',
        message: 'Falta el NIF/CIF del proveedor',
        field: 'supplierTaxId',
        severity: 'error'
      },
      {
        code: 'INCONSISTENT_VAT',
        message: 'IVA incoherente. Esperado: 21.00€, encontrado: 15.00€',
        field: 'vatAmount',
        severity: 'error'
      }
    ],
    warnings: [
      {
        code: 'MISSING_IRPF',
        message: 'Se esperaba retención IRPF para servicios profesionales',
        field: 'irpfRate',
        suggestion: 'Verificar si aplica retención del 15% o 7% según el caso'
      }
    ]
  }

  const mockValidationWithoutIssues: SpanishTaxValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  it('should not render anything when no issues and showSuccess is false', () => {
    const { container } = render(
      <ValidationDisplay validation={mockValidationWithoutIssues} showSuccess={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should show success message when no issues and showSuccess is true', () => {
    render(
      <ValidationDisplay validation={mockValidationWithoutIssues} showSuccess={true} />
    )
    
    expect(screen.getByText('Validación fiscal correcta')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('border-green-200', 'bg-green-50')
  })

  it('should display errors with correct styling and content', () => {
    render(<ValidationDisplay validation={mockValidationWithErrors} />)
    
    // Check error messages
    expect(screen.getByText('Falta el NIF/CIF del proveedor')).toBeInTheDocument()
    expect(screen.getByText(/IVA incoherente/)).toBeInTheDocument()
    
    // Check error badges
    const errorBadges = screen.getAllByText('ERROR')
    expect(errorBadges).toHaveLength(2)
    
    // Check field information
    expect(screen.getByText('Campo: supplierTaxId')).toBeInTheDocument()
    expect(screen.getByText('Campo: vatAmount')).toBeInTheDocument()
  })

  it('should display warnings with correct styling and suggestions', () => {
    render(<ValidationDisplay validation={mockValidationWithErrors} />)
    
    // Check warning message
    expect(screen.getByText('Se esperaba retención IRPF para servicios profesionales')).toBeInTheDocument()
    
    // Check warning badge
    expect(screen.getByText('AVISO')).toBeInTheDocument()
    
    // Check suggestion
    expect(screen.getByText('Verificar si aplica retención del 15% o 7% según el caso')).toBeInTheDocument()
    expect(screen.getByText('Recomendación:')).toBeInTheDocument()
    
    // Check field information for warning
    expect(screen.getByText('Campo: irpfRate')).toBeInTheDocument()
  })

  it('should have correct alert styling for errors', () => {
    render(<ValidationDisplay validation={mockValidationWithErrors} />)
    
    const errorAlerts = screen.getAllByRole('alert').filter(alert => 
      alert.textContent?.includes('ERROR')
    )
    
    errorAlerts.forEach(alert => {
      expect(alert).toHaveAttribute('data-state') // Radix UI alert attribute
    })
  })

  it('should have correct alert styling for warnings', () => {
    render(<ValidationDisplay validation={mockValidationWithErrors} />)
    
    const warningAlert = screen.getByRole('alert', { name: /aviso/i })
    expect(warningAlert).toHaveClass('border-yellow-200', 'bg-yellow-50')
  })
})

describe('ValidationSummary', () => {
  it('should display correct statistics', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={5}
        totalWarnings={15}
      />
    )
    
    expect(screen.getByText('100')).toBeInTheDocument() // Total
    expect(screen.getByText('95')).toBeInTheDocument()  // Valid (100-5)
    expect(screen.getByText('5')).toBeInTheDocument()   // Errors
    expect(screen.getByText('15')).toBeInTheDocument()  // Warnings
  })

  it('should calculate correct health percentage', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={10}
        totalWarnings={5}
      />
    )
    
    // Health = (100-10)/100 * 100 = 90%
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  it('should show green health bar for high score (>=90%)', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={5}
        totalWarnings={3}
      />
    )
    
    const healthText = screen.getByText('95%')
    expect(healthText).toHaveClass('text-green-600')
  })

  it('should show yellow health bar for medium score (70-89%)', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={25}
        totalWarnings={5}
      />
    )
    
    const healthText = screen.getByText('75%')
    expect(healthText).toHaveClass('text-yellow-600')
  })

  it('should show red health bar for low score (<70%)', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={50}
        totalWarnings={10}
      />
    )
    
    const healthText = screen.getByText('50%')
    expect(healthText).toHaveClass('text-red-600')
  })

  it('should show error alert when there are errors', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={5}
        totalWarnings={0}
      />
    )
    
    expect(screen.getByText(/5 errores fiscales que requieren atención inmediata/)).toBeInTheDocument()
  })

  it('should show warning alert when there are only warnings', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={0}
        totalWarnings={8}
      />
    )
    
    expect(screen.getByText(/8 avisos que deberías revisar/)).toBeInTheDocument()
  })

  it('should not show alerts when there are no issues', () => {
    render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={0}
        totalWarnings={0}
      />
    )
    
    // Should not have error or warning alerts
    expect(screen.queryByText(/errores fiscales/)).not.toBeInTheDocument()
    expect(screen.queryByText(/avisos que deberías/)).not.toBeInTheDocument()
  })

  it('should handle edge case with zero transactions', () => {
    render(
      <ValidationSummary 
        totalTransactions={0}
        totalErrors={0}
        totalWarnings={0}
      />
    )
    
    expect(screen.getByText('0')).toBeInTheDocument() // Total
    expect(screen.getByText('0%')).toBeInTheDocument() // Should handle division by zero
  })

  it('should have correct styling for health percentage progress bar', () => {
    const { rerender } = render(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={5}
        totalWarnings={0}
      />
    )
    
    // Check for green progress bar (95% health)
    let progressBar = document.querySelector('.bg-green-500')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '95%' })
    
    // Test yellow health (75%)
    rerender(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={25}
        totalWarnings={0}
      />
    )
    
    progressBar = document.querySelector('.bg-yellow-500')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '75%' })
    
    // Test red health (50%)
    rerender(
      <ValidationSummary 
        totalTransactions={100}
        totalErrors={50}
        totalWarnings={0}
      />
    )
    
    progressBar = document.querySelector('.bg-red-500')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ width: '50%' })
  })
})

describe('ValidationDisplay and ValidationSummary Integration', () => {
  it('should work together to provide comprehensive validation feedback', () => {
    const validation: SpanishTaxValidationResult = {
      isValid: false,
      errors: [
        {
          code: 'MISSING_TAX_ID',
          message: 'Falta el NIF/CIF del proveedor',
          field: 'supplierTaxId',
          severity: 'error'
        }
      ],
      warnings: [
        {
          code: 'QUESTIONABLE_DEDUCTIBLE',
          message: 'Gasto marcado como deducible pero la categoría requiere justificación',
          field: 'deductible',
          suggestion: 'Conserve documentación justificativa'
        }
      ]
    }
    
    render(
      <div>
        <ValidationSummary 
          totalTransactions={10}
          totalErrors={1}
          totalWarnings={1}
        />
        <ValidationDisplay validation={validation} />
      </div>
    )
    
    // Summary should show statistics
    expect(screen.getByText('10')).toBeInTheDocument() // Total transactions
    expect(screen.getByText('1')).toBeInTheDocument()  // Errors count
    
    // Display should show specific error details
    expect(screen.getByText('Falta el NIF/CIF del proveedor')).toBeInTheDocument()
    expect(screen.getByText('Conserve documentación justificativa')).toBeInTheDocument()
  })
})