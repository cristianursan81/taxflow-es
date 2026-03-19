import { prisma } from "@/lib/db"

export const DEFAULT_PROMPT_ANALYSE_NEW_FILE = `Eres un asistente contable especializado en el sistema fiscal español. Analiza el documento (factura, ticket, recibo) y extrae la siguiente información:

{fields}

CAMPOS ESPECÍFICOS ESPAÑOLES OBLIGATORIOS:
- supplierName: Nombre del proveedor/emisor
- supplierTaxId: NIF/CIF del proveedor (formato español)
- invoiceNumber: Número de factura o ticket
- invoiceType: Tipo de documento (factura, ticket, recibo, factura simplificada)
- baseAmount: Importe base (sin IVA)
- vatRate: Tipo de IVA aplicado (21%, 10%, 4%, exento)
- vatAmount: Cuota de IVA
- irpfRate: Porcentaje de IRPF (si aplica)
- irpfAmount: Retención de IRPF (si aplica)
- grossTotal: Total bruto (base + IVA)
- deductible: Si el gasto es deducible (true/false)
- taxValidationStatus: Estado de validación fiscal

También extrae "items": todos los productos o servicios detallados de la factura

Categorías disponibles:
{categories}

Proyectos disponibles:
{projects}

REGLAS CRÍTICAS PARA ESPAÑA:
- SIEMPRE extraer y validar NIF/CIF del emisor
- Calcular correctamente base imponible, IVA e IRPF
- Identificar el tipo correcto de IVA (general 21%, reducido 10%, superreducido 4%, exento)
- Detectar si aplica retención IRPF (servicios profesionales, arrendamientos, etc.)
- Marcar como NO deducible: gastos personales, multas, lujo
- Validar coherencia: base + IVA = total
- Clasificar documento: factura completa vs ticket simplificado
- NUNCA inventar datos, dejar en blanco si no está claro
- Responder SOLO con un objeto JSON, sin texto adicional`

export const DEFAULT_SETTINGS = [
  {
    code: "default_currency",
    name: "Default Currency",
    description: "Don't change this setting if you already have multi-currency transactions. I won't recalculate them.",
    value: "EUR",
  },
  {
    code: "default_category",
    name: "Default Category",
    description: "",
    value: "otros",
  },
  {
    code: "default_project",
    name: "Default Project",
    description: "",
    value: "personal",
  },
  {
    code: "default_type",
    name: "Default Type",
    description: "",
    value: "expense",
  },
  {
    code: "prompt_analyse_new_file",
    name: "Prompt for Analyze Transaction",
    description: "Allowed variables: {fields}, {categories}, {categories.code}, {projects}, {projects.code}",
    value: DEFAULT_PROMPT_ANALYSE_NEW_FILE,
  },
  {
    code: "is_welcome_message_hidden",
    name: "Do not show welcome message on dashboard",
    description: "",
    value: "false",
  },
]

export const DEFAULT_CATEGORIES = [
  {
    code: "suministros",
    name: "Suministros y Material",
    color: "#c69713",
    llm_prompt: "materiales, suministros, material de oficina, papelería, consumibles",
  },
  {
    code: "software_suscripciones",
    name: "Software y Suscripciones",
    color: "#8753fb",
    llm_prompt: "software, suscripciones SaaS, licencias, applications, herramientas digitales",
  },
  {
    code: "alquiler",
    name: "Alquiler y Arrendamientos",
    color: "#050942",
    llm_prompt: "alquiler, arrendamiento, renting, leasing, location",
  },
  {
    code: "telecomunicaciones",
    name: "Telecomunicaciones",
    color: "#0e7d86",
    llm_prompt: "teléfono, internet, móvil, comunicaciones, fibra, ADSL",
  },
  {
    code: "transporte",
    name: "Transporte y Desplazamientos",
    color: "#800000",
    llm_prompt: "combustible, gasolina, diesel, transporte público, taxi, kilometraje, peajes",
  },
  {
    code: "dietas_restauracion",
    name: "Dietas y Restauración",
    color: "#d40e70",
    llm_prompt: "comidas de negocio, dietas, restaurante, catering, manutención",
  },
  {
    code: "servicios_profesionales",
    name: "Servicios Profesionales",
    color: "#064e85",
    llm_prompt: "asesoría, gestoría, abogados, consultores, servicios externos",
  },
  {
    code: "formacion",
    name: "Formación y Desarrollo",
    color: "#ee5d6c",
    llm_prompt: "cursos, formación, seminarios, congresos, educación professional",
  },
  {
    code: "seguros",
    name: "Seguros",
    color: "#1e6359",
    llm_prompt: "seguros, pólizas, prima de seguro, responsabilidad civil",
  },
  {
    code: "suministros_energia",
    name: "Suministros de Energía",
    color: "#af7e2e",
    llm_prompt: "electricidad, gas, agua, facturas de suministros básicos",
  },
  {
    code: "publicidad_marketing",
    name: "Publicidad y Marketing",
    color: "#882727",
    llm_prompt: "publicidad, marketing, promoción, anuncios, campañas",
  },
  {
    code: "reparacion_mantenimiento",
    name: "Reparación y Mantenimiento",
    color: "#59b0b9",
    llm_prompt: "reparaciones, mantenimiento, servicios técnicos",
  },
  {
    code: "equipos_tecnologicos",
    name: "Equipos Tecnológicos",
    color: "#2b5a1d",
    llm_prompt: "ordenadores, hardware, equipos informáticos, tecnología",
  },
  {
    code: "gastos_financieros",
    name: "Gastos Financieros",
    color: "#6a0d83",
    llm_prompt: "intereses, comisiones bancarias, gastos financieros",
  },
  {
    code: "representacion",
    name: "Gastos de Representación",
    color: "#fb9062",
    llm_prompt: "regalos de empresa, atenciones a clientes, representación",
  },
  {
    code: "otros",
    name: "Otros Gastos",
    color: "#121216",
    llm_prompt: "otros gastos deducibles, miscelánea",
  },
]

export const DEFAULT_PROJECTS = [{ code: "personal", name: "Personal", llm_prompt: "personal", color: "#1e202b" }]

export const DEFAULT_CURRENCIES = [
  { code: "USD", name: "$" },
  { code: "EUR", name: "€" },
  { code: "GBP", name: "£" },
  { code: "INR", name: "₹" },
  { code: "AUD", name: "$" },
  { code: "CAD", name: "$" },
  { code: "SGD", name: "$" },
  { code: "CHF", name: "Fr" },
  { code: "MYR", name: "RM" },
  { code: "JPY", name: "¥" },
  { code: "CNY", name: "¥" },
  { code: "NZD", name: "$" },
  { code: "THB", name: "฿" },
  { code: "HUF", name: "Ft" },
  { code: "AED", name: "د.إ" },
  { code: "HKD", name: "$" },
  { code: "MXN", name: "$" },
  { code: "ZAR", name: "R" },
  { code: "PHP", name: "₱" },
  { code: "SEK", name: "kr" },
  { code: "IDR", name: "Rp" },
  { code: "BRL", name: "R$" },
  { code: "SAR", name: "﷼" },
  { code: "TRY", name: "₺" },
  { code: "KES", name: "KSh" },
  { code: "KRW", name: "₩" },
  { code: "EGP", name: "£" },
  { code: "IQD", name: "ع.د" },
  { code: "NOK", name: "kr" },
  { code: "KWD", name: "د.ك" },
  { code: "RUB", name: "₽" },
  { code: "DKK", name: "kr" },
  { code: "PKR", name: "₨" },
  { code: "ILS", name: "₪" },
  { code: "PLN", name: "zł" },
  { code: "QAR", name: "﷼" },
  { code: "OMR", name: "﷼" },
  { code: "COP", name: "$" },
  { code: "CLP", name: "$" },
  { code: "TWD", name: "NT$" },
  { code: "ARS", name: "$" },
  { code: "CZK", name: "Kč" },
  { code: "VND", name: "₫" },
  { code: "MAD", name: "د.م." },
  { code: "JOD", name: "د.ا" },
  { code: "BHD", name: ".د.ب" },
  { code: "XOF", name: "CFA" },
  { code: "LKR", name: "₨" },
  { code: "UAH", name: "₴" },
  { code: "NGN", name: "₦" },
  { code: "TND", name: "د.ت" },
  { code: "UGX", name: "USh" },
  { code: "RON", name: "lei" },
  { code: "BDT", name: "৳" },
  { code: "PEN", name: "S/" },
  { code: "GEL", name: "₾" },
  { code: "XAF", name: "FCFA" },
  { code: "FJD", name: "$" },
  { code: "VEF", name: "Bs" },
  { code: "VES", name: "Bs.S" },
  { code: "BYN", name: "Br" },
  { code: "UZS", name: "лв" },
  { code: "BGN", name: "лв" },
  { code: "DZD", name: "د.ج" },
  { code: "IRR", name: "﷼" },
  { code: "DOP", name: "RD$" },
  { code: "ISK", name: "kr" },
  { code: "CRC", name: "₡" },
  { code: "SYP", name: "£" },
  { code: "JMD", name: "J$" },
  { code: "LYD", name: "ل.د" },
  { code: "GHS", name: "₵" },
  { code: "MUR", name: "₨" },
  { code: "AOA", name: "Kz" },
  { code: "UYU", name: "$U" },
  { code: "AFN", name: "؋" },
  { code: "LBP", name: "ل.ل" },
  { code: "XPF", name: "₣" },
  { code: "TTD", name: "TT$" },
  { code: "TZS", name: "TSh" },
  { code: "ALL", name: "Lek" },
  { code: "XCD", name: "$" },
  { code: "GTQ", name: "Q" },
  { code: "NPR", name: "₨" },
  { code: "BOB", name: "Bs." },
  { code: "ZWD", name: "Z$" },
  { code: "BBD", name: "$" },
  { code: "CUC", name: "$" },
  { code: "LAK", name: "₭" },
  { code: "BND", name: "$" },
  { code: "BWP", name: "P" },
  { code: "HNL", name: "L" },
  { code: "PYG", name: "₲" },
  { code: "ETB", name: "Br" },
  { code: "NAD", name: "$" },
  { code: "PGK", name: "K" },
  { code: "SDG", name: "ج.س." },
  { code: "MOP", name: "MOP$" },
  { code: "BMD", name: "$" },
  { code: "NIO", name: "C$" },
  { code: "BAM", name: "KM" },
  { code: "KZT", name: "₸" },
  { code: "PAB", name: "B/." },
  { code: "GYD", name: "$" },
  { code: "YER", name: "﷼" },
  { code: "MGA", name: "Ar" },
  { code: "KYD", name: "$" },
  { code: "MZN", name: "MT" },
  { code: "RSD", name: "дин." },
  { code: "SCR", name: "₨" },
  { code: "AMD", name: "֏" },
  { code: "AZN", name: "₼" },
  { code: "SBD", name: "$" },
  { code: "SLL", name: "Le" },
  { code: "TOP", name: "T$" },
  { code: "BZD", name: "BZ$" },
  { code: "GMD", name: "D" },
  { code: "MWK", name: "MK" },
  { code: "BIF", name: "FBu" },
  { code: "HTG", name: "G" },
  { code: "SOS", name: "S" },
  { code: "GNF", name: "FG" },
  { code: "MNT", name: "₮" },
  { code: "MVR", name: "Rf" },
  { code: "CDF", name: "FC" },
  { code: "STN", name: "Db" },
  { code: "TJS", name: "ЅМ" },
  { code: "KPW", name: "₩" },
  { code: "KGS", name: "лв" },
  { code: "LRD", name: "$" },
  { code: "LSL", name: "L" },
  { code: "MMK", name: "K" },
  { code: "GIP", name: "£" },
  { code: "MDL", name: "L" },
  { code: "CUP", name: "₱" },
  { code: "KHR", name: "៛" },
  { code: "MKD", name: "ден" },
  { code: "VUV", name: "VT" },
  { code: "ANG", name: "ƒ" },
  { code: "MRU", name: "UM" },
  { code: "SZL", name: "L" },
  { code: "CVE", name: "$" },
  { code: "SRD", name: "$" },
  { code: "SVC", name: "$" },
  { code: "BSD", name: "$" },
  { code: "RWF", name: "R₣" },
  { code: "AWG", name: "ƒ" },
  { code: "BTN", name: "Nu." },
  { code: "DJF", name: "Fdj" },
  { code: "KMF", name: "CF" },
  { code: "ERN", name: "Nfk" },
  { code: "FKP", name: "£" },
  { code: "SHP", name: "£" },
  { code: "WST", name: "WS$" },
  { code: "JEP", name: "£" },
  { code: "TMT", name: "m" },
  { code: "GGP", name: "£" },
  { code: "IMP", name: "£" },
  { code: "TVD", name: "$" },
  { code: "ZMW", name: "ZK" },
  { code: "ADA", name: "Crypto" },
  { code: "BCH", name: "Crypto" },
  { code: "BTC", name: "Crypto" },
  { code: "CLF", name: "UF" },
  { code: "CNH", name: "¥" },
  { code: "DOGE", name: "Crypto" },
  { code: "DOT", name: "Crypto" },
  { code: "ETH", name: "Crypto" },
  { code: "LINK", name: "Crypto" },
  { code: "LTC", name: "Crypto" },
  { code: "LUNA", name: "Crypto" },
  { code: "SLE", name: "Le" },
  { code: "UNI", name: "Crypto" },
  { code: "XBT", name: "Crypto" },
  { code: "XLM", name: "Crypto" },
  { code: "XRP", name: "Crypto" },
  { code: "ZWL", name: "$" },
]

export const DEFAULT_FIELDS = [
  {
    code: "name",
    name: "Name",
    type: "string",
    llm_prompt: "human readable name, summarize what is bought or paid for in the invoice",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: true,
    isExtra: false,
  },
  {
    code: "description",
    name: "Description",
    type: "string",
    llm_prompt: "description of the transaction",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "merchant",
    name: "Merchant",
    type: "string",
    llm_prompt: "merchant name, use the original spelling and language",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "issuedAt",
    name: "Issued At",
    type: "string",
    llm_prompt: "issued at date (YYYY-MM-DD format)",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: true,
    isExtra: false,
  },
  {
    code: "projectCode",
    name: "Project",
    type: "string",
    llm_prompt: "project code, one of: {projects.code}",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "categoryCode",
    name: "Category",
    type: "string",
    llm_prompt: "category code, one of: {categories.code}",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "files",
    name: "Files",
    type: "string",
    llm_prompt: "",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "total",
    name: "Total",
    type: "number",
    llm_prompt: "total total of the transaction",
    isVisibleInList: true,
    isVisibleInAnalysis: true,
    isRequired: true,
    isExtra: false,
  },
  {
    code: "currencyCode",
    name: "Currency",
    type: "string",
    llm_prompt: "currency code, ISO 4217 three letter code like USD, EUR, including crypto codes like BTC, ETH, etc",
    isVisibleInList: false,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "convertedTotal",
    name: "Converted Total",
    type: "number",
    llm_prompt: "",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "convertedCurrencyCode",
    name: "Converted Currency Code",
    type: "string",
    llm_prompt: "",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "type",
    name: "Type",
    type: "string",
    llm_prompt: "",
    isVisibleInList: false,
    isVisibleInAnalysis: true,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "note",
    name: "Note",
    type: "string",
    llm_prompt: "",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: false,
  },
  {
    code: "vat_rate",
    name: "VAT Rate",
    type: "number",
    llm_prompt: "VAT rate in percentage 0-100",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: true,
  },
  {
    code: "vat",
    name: "VAT Amount",
    type: "number",
    llm_prompt: "total VAT in currency of the invoice",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: true,
  },
  {
    code: "text",
    name: "Extracted Text",
    type: "string",
    llm_prompt: "extract all recognised text from the invoice",
    isVisibleInList: false,
    isVisibleInAnalysis: false,
    isRequired: false,
    isExtra: false,
  },
]

export async function createUserDefaults(userId: string) {
  // Default projects
  for (const project of DEFAULT_PROJECTS) {
    await prisma.project.upsert({
      where: { userId_code: { code: project.code, userId } },
      update: { name: project.name, color: project.color, llm_prompt: project.llm_prompt },
      create: { ...project, userId },
    })
  }

  // Default categories
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { userId_code: { code: category.code, userId } },
      update: { name: category.name, color: category.color, llm_prompt: category.llm_prompt },
      create: { ...category, userId },
    })
  }

  // Default currencies
  for (const currency of DEFAULT_CURRENCIES) {
    await prisma.currency.upsert({
      where: { userId_code: { code: currency.code, userId } },
      update: { name: currency.name },
      create: { ...currency, userId },
    })
  }

  // Default fields
  for (const field of DEFAULT_FIELDS) {
    await prisma.field.upsert({
      where: { userId_code: { code: field.code, userId } },
      update: {
        name: field.name,
        type: field.type,
        llm_prompt: field.llm_prompt,
        isVisibleInList: field.isVisibleInList,
        isVisibleInAnalysis: field.isVisibleInAnalysis,
        isRequired: field.isRequired,
        isExtra: field.isExtra,
      },
      create: { ...field, userId },
    })
  }

  // Default settings
  for (const setting of DEFAULT_SETTINGS) {
    await prisma.setting.upsert({
      where: { userId_code: { code: setting.code, userId } },
      update: { name: setting.name, description: setting.description, value: setting.value },
      create: { ...setting, userId },
    })
  }
}

export async function isDatabaseEmpty(userId: string) {
  const fieldsCount = await prisma.field.count({ where: { userId } })
  return fieldsCount === 0
}
