"use client"

import { useMemo } from "react"
import { validateSpanishTransaction, TransactionData, SpanishTaxValidationResult } from "@/lib/spanish-tax-validator"

export function useSpanishTaxValidation(transactionData: TransactionData): SpanishTaxValidationResult {
  return useMemo(() => {
    if (!transactionData) {
      return {
        isValid: true,
        errors: [],
        warnings: []
      }
    }

    return validateSpanishTransaction(transactionData)
  }, [transactionData])
}

export function useMultipleTransactionsValidation(transactions: TransactionData[]): {
  totalErrors: number
  totalWarnings: number
  hasErrors: boolean
  hasWarnings: boolean
  results: SpanishTaxValidationResult[]
} {
  return useMemo(() => {
    const results = transactions.map(transaction => validateSpanishTransaction(transaction))
    
    const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0)
    const totalWarnings = results.reduce((sum, result) => sum + result.warnings.length, 0)

    return {
      totalErrors,
      totalWarnings,
      hasErrors: totalErrors > 0,
      hasWarnings: totalWarnings > 0,
      results
    }
  }, [transactions])
}