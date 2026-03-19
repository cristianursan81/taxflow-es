import { getCurrentUser } from "@/lib/auth"
import { getTransactions } from "@/models/transactions"
import { format } from "@fast-csv/format"
import { formatDate } from "date-fns"
import { NextResponse } from "next/server"
import { Readable } from "stream"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const fromDate = url.searchParams.get("fromDate")
  const toDate = url.searchParams.get("toDate")
  const year = url.searchParams.get("year") || new Date().getFullYear().toString()

  const user = await getCurrentUser()
  
  const filters = {
    fromDate: fromDate || `${year}-01-01`,
    toDate: toDate || `${year}-12-31`,
    type: "income"
  }

  const { transactions } = await getTransactions(user.id, filters)

  // Campos específicos para el libro de ingresos español
  const headers = [
    "Fecha",
    "Cliente",
    "NIF/CIF",
    "Nº Factura",
    "Concepto",
    "Base Imponible",
    "Tipo IVA (%)",
    "Cuota IVA",
    "Tipo IRPF (%)",
    "Cuota IRPF",
    "Total",
    "Cobrado",
    "Fecha Cobro"
  ]

  const csvStream = format({ 
    headers, 
    writeBOM: true, 
    writeHeaders: true 
  })

  for (const transaction of transactions) {
    const row = [
      transaction.issuedAt ? formatDate(transaction.issuedAt, "dd/MM/yyyy") : "",
      transaction.supplierName || transaction.merchant || "",
      transaction.supplierTaxId || "",
      transaction.invoiceNumber || "",
      transaction.description || transaction.name || "",
      ((transaction.baseAmount || transaction.total || 0) / 100).toFixed(2),
      transaction.vatRate ? transaction.vatRate.toString() : "",
      ((transaction.vatAmount || 0) / 100).toFixed(2),
      transaction.irpfRate ? transaction.irpfRate.toString() : "",
      ((transaction.irpfAmount || 0) / 100).toFixed(2),
      ((transaction.grossTotal || transaction.total || 0) / 100).toFixed(2),
      "SÍ", // Por defecto asumimos cobrado
      transaction.issuedAt ? formatDate(transaction.issuedAt, "dd/MM/yyyy") : ""
    ]
    csvStream.write(row)
  }

  csvStream.end()

  const stream = Readable.from(csvStream)
  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="libro-ingresos-${year}.csv"`,
    },
  })
}