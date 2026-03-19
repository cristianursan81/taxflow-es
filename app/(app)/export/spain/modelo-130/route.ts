import { getCurrentUser } from "@/lib/auth"
import { getTransactions } from "@/models/transactions"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const year = parseInt(url.searchParams.get("year") || new Date().getFullYear().toString())
  const quarter = parseInt(url.searchParams.get("quarter") || "1")

  const user = await getCurrentUser()
  
  // Calcular fechas del trimestre
  const quarterStart = new Date(year, (quarter - 1) * 3, 1)
  const quarterEnd = new Date(year, quarter * 3, 0)

  const filters = {
    fromDate: quarterStart.toISOString().split('T')[0],
    toDate: quarterEnd.toISOString().split('T')[0]
  }

  const { transactions } = await getTransactions(user.id, filters)

  // Separar ingresos y gastos
  const ingresos = transactions.filter(t => t.type === 'income')
  const gastos = transactions.filter(t => t.type === 'expense' && t.deductible !== false)

  // Calcular totales
  const totalIngresos = ingresos.reduce((sum, t) => sum + (t.total || 0), 0) / 100
  const totalGastosDeducibles = gastos.reduce((sum, t) => sum + (t.total || 0), 0) / 100
  const totalIrpfRetenido = ingresos.reduce((sum, t) => sum + (t.irpfAmount || 0), 0) / 100
  
  // Base imponible (ingresos - gastos)
  const baseImponible = totalIngresos - totalGastosDeducibles
  
  // Cálculo del pago fraccionado (20% como estimación)
  const pagoFraccionado = Math.max(0, baseImponible * 0.20)
  
  // Líquido a ingresar (pago fraccionado - retenciones)
  const liquidoIngresar = Math.max(0, pagoFraccionado - totalIrpfRetenido)

  // Resumen para modelo 130
  const resumen = {
    ejercicio: year,
    periodo: quarter.toString().padStart(2, '0'),
    ingresos: totalIngresos.toFixed(2),
    gastosDeducibles: totalGastosDeducibles.toFixed(2),
    baseImponible: baseImponible.toFixed(2),
    pagoFraccionado: pagoFraccionado.toFixed(2),
    retenciones: totalIrpfRetenido.toFixed(2),
    liquidoIngresar: liquidoIngresar.toFixed(2),
    numeroFacturasIngresos: ingresos.length,
    numeroGastosDeducibles: gastos.length,
    fechaGeneracion: new Date().toISOString().split('T')[0],
    observaciones: "Cálculo estimativo. Consulte con su asesor fiscal para validar los datos."
  }

  return NextResponse.json(resumen, {
    headers: {
      "Content-Disposition": `attachment; filename="modelo-130-${year}-T${quarter}.json"`,
    },
  })
}