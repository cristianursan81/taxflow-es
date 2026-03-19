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
  const gastos = transactions.filter(t => t.type === 'expense')

  // Calcular totales de IVA
  const ivaRepercutido = ingresos.reduce((sum, t) => sum + (t.vatAmount || 0), 0) / 100
  const ivaSoportado = gastos.reduce((sum, t) => sum + (t.vatAmount || 0), 0) / 100
  const ivaTrameEmpresarial = ingresos.reduce((sum, t) => sum + (t.baseAmount || t.total || 0), 0) / 100
  const ivaCompras = gastos.reduce((sum, t) => sum + (t.baseAmount || t.total || 0), 0) / 100

  // Resumen para modelo 303
  const resumen = {
    ejercicio: year,
    periodo: quarter.toString().padStart(2, '0'),
    ivaRepercutido: ivaRepercutido.toFixed(2),
    ivaSoportado: ivaSoportado.toFixed(2),
    diferenciaIva: (ivaRepercutido - ivaSoportado).toFixed(2),
    baseImponibleVentas: ivaTrameEmpresarial.toFixed(2),
    baseImponibleCompras: ivaCompras.toFixed(2),
    numeroFacturasEmitidas: ingresos.length,
    numeroFacturasRecibidas: gastos.length,
    fechaGeneracion: new Date().toISOString().split('T')[0]
  }

  return NextResponse.json(resumen, {
    headers: {
      "Content-Disposition": `attachment; filename="modelo-303-${year}-T${quarter}.json"`,
    },
  })
}