"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpanishTaxValidationResult } from "@/lib/spanish-tax-validator"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ValidationDisplayProps {
  validation: SpanishTaxValidationResult
  showSuccess?: boolean
}

export function ValidationDisplay({ validation, showSuccess = false }: ValidationDisplayProps) {
  const hasIssues = validation.errors.length > 0 || validation.warnings.length > 0

  if (!hasIssues && !showSuccess) {
    return null
  }

  if (!hasIssues && showSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Validación fiscal correcta
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {validation.errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{error.message}</span>
              <Badge variant="destructive" className="text-xs">
                ERROR
              </Badge>
            </div>
            {error.field && (
              <div className="text-xs text-muted-foreground mt-1">
                Campo: {error.field}
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}

      {validation.warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-yellow-800">{warning.message}</span>
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                AVISO
              </Badge>
            </div>
            {warning.suggestion && (
              <div className="text-xs text-yellow-700 mt-2 p-2 bg-yellow-100 rounded">
                <strong>Recomendación:</strong> {warning.suggestion}
              </div>
            )}
            {warning.field && (
              <div className="text-xs text-muted-foreground mt-1">
                Campo: {warning.field}
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

interface ValidationSummaryProps {
  totalTransactions: number
  totalErrors: number
  totalWarnings: number
}

export function ValidationSummary({ 
  totalTransactions, 
  totalErrors, 
  totalWarnings 
}: ValidationSummaryProps) {
  const validTransactions = totalTransactions - totalErrors
  const healthPercentage = Math.round((validTransactions / Math.max(totalTransactions, 1)) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5" />
          Resumen de Validación Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{validTransactions}</div>
            <div className="text-xs text-muted-foreground">Válidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
            <div className="text-xs text-muted-foreground">Errores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalWarnings}</div>
            <div className="text-xs text-muted-foreground">Avisos</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Salud Fiscal</span>
            <span className={`font-medium ${
              healthPercentage >= 90 ? 'text-green-600' : 
              healthPercentage >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {healthPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                healthPercentage >= 90 ? 'bg-green-500' : 
                healthPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {totalErrors > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Hay {totalErrors} errores fiscales que requieren atención inmediata
            </AlertDescription>
          </Alert>
        )}

        {totalWarnings > 0 && totalErrors === 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Hay {totalWarnings} avisos que deberías revisar para optimizar el cumplimiento fiscal
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}