"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDownload } from "@/hooks/use-download"
import { FileBarChart, Download } from "lucide-react"
import { useState } from "react"

const EXPORT_TYPES = [
  { 
    key: "libro-gastos", 
    label: "Libro de Gastos", 
    description: "Registro detallado de todos los gastos del periodo"
  },
  { 
    key: "libro-ingresos", 
    label: "Libro de Ingresos", 
    description: "Registro detallado de todos los ingresos del periodo"
  },
  { 
    key: "modelo-303", 
    label: "Resumen Modelo 303", 
    description: "Declaración trimestral de IVA"
  },
  { 
    key: "modelo-130", 
    label: "Resumen Modelo 130", 
    description: "Pago fraccionado trimestral IRPF"
  }
]

const QUARTERS = [
  { value: "1", label: "1º Trimestre (Ene-Mar)" },
  { value: "2", label: "2º Trimestre (Abr-Jun)" },
  { value: "3", label: "3º Trimestre (Jul-Sep)" },
  { value: "4", label: "4º Trimestre (Oct-Dic)" }
]

export function ExportSpainDialog({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [exportType, setExportType] = useState<string>("")
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [quarter, setQuarter] = useState<string>("1")
  const [isOpen, setIsOpen] = useState(false)

  const { download, isDownloading } = useDownload()

  const selectedExport = EXPORT_TYPES.find(t => t.key === exportType)
  const isModeloExport = exportType.includes("modelo")

  const handleExport = async () => {
    if (!exportType) return

    let url = `/export/spain/${exportType}?year=${year}`
    if (isModeloExport) {
      url += `&quarter=${quarter}`
    }

    try {
      await download(url, `${exportType}-${year}${isModeloExport ? `-T${quarter}` : ""}.csv`)
      setIsOpen(false)
    } catch (error) {
      console.error("Error al exportar:", error)
    }
  }

  // Generar años (actual y 5 anteriores)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Exportes Fiscales España
          </DialogTitle>
          <DialogDescription>
            Genera reportes adaptados a la normativa fiscal española
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="export-type">Tipo de Reporte</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de exportación" />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_TYPES.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Año</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isModeloExport && (
              <div className="grid gap-2">
                <Label htmlFor="quarter">Trimestre</Label>
                <Select value={quarter} onValueChange={setQuarter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUARTERS.map((q) => (
                      <SelectItem key={q.value} value={q.value}>
                        {q.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedExport && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <strong>{selectedExport.label}</strong>
              <p className="text-muted-foreground mt-1">{selectedExport.description}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={!exportType || isDownloading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Exportando..." : "Exportar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}