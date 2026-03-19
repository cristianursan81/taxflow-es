# Adaptación TaxFlow-ES para España 🇪🇸

## Resumen de Cambios Implementados

Esta documentación resume todas las adaptaciones realizadas para convertir TaxFlow en una solución específica para el sistema fiscal español.

### ✅ PRIORIDAD 1: Branding y Despliegue

#### Cambios de branding técnico:
- **package.json**: Nombre cambiado a `taxflow-es`
- **Docker Compose**: 
  - Base de datos: `TaxFlow ES` → `taxflow-es`
  - Container names: `TaxFlow ES-postgres` → `taxflow-es-postgres`
  - Images: `ghcr.io/vas3k/TaxFlow ES` → `ghcr.io/your-org/taxflow-es`
- **Middleware**: Cookie prefix cambiado a `taxflow-es`
- **GitHub Actions**: Imagen Docker actualizada
- **Variables de entorno**: DATABASE_URL actualizada
- **LICENSE**: Copyright actualizado
- **Documentación**: Referencias corregidas

#### Referencias vas3k eliminadas:
- Archivo `.github/FUNDING.yml` eliminado
- Referencias en documentación actualizadas
- Enlaces de donación eliminados

### ✅ PRIORIDAD 2: Modelo de Transacción Español

#### Nuevos campos añadidos al schema:
- `supplierName`: Nombre del proveedor
- `supplierTaxId`: NIF/CIF del proveedor
- `invoiceNumber`: Número de factura
- `invoiceType`: Tipo de documento
- `baseAmount`: Importe base sin IVA
- `vatRate`: Tipo de IVA (%)
- `vatAmount`: Cuota de IVA
- `irpfRate`: Tipo de IRPF (%)
- `irpfAmount`: Retención IRPF
- `grossTotal`: Total bruto
- `deductible`: Gasto deducible (boolean)
- `taxValidationStatus`: Estado de validación fiscal

#### Base de datos:
- Migración creada: `20250319000000_add_spanish_fiscal_fields`
- Índices añadidos para optimización de consultas
- Soporte para tipos decimales para porcentajes

### ✅ PRIORIDAD 3: Categorías y Prompt Españoles

#### Nuevas categorías fiscales:
- **suministros**: Material y suministros
- **software_suscripciones**: Software y suscripciones SaaS
- **alquiler**: Alquileres y arrendamientos
- **telecomunicaciones**: Teléfono e internet
- **transporte**: Transporte y combustible
- **dietas_restauracion**: Comidas de negocio y dietas
- **servicios_profesionales**: Asesorías y consultores
- **formacion**: Cursos y formación
- **seguros**: Pólizas de seguro
- **suministros_energia**: Electricidad, gas, agua
- **publicidad_marketing**: Publicidad y marketing
- **reparacion_mantenimiento**: Reparaciones
- **equipos_tecnologicos**: Hardware y equipos
- **gastos_financieros**: Comisiones bancarias
- **representacion**: Gastos de representación
- **otros**: Otros gastos

#### Prompt de análisis rediseñado:
- **Orientado al sistema fiscal español**
- **Extracción obligatoria** de NIF/CIF
- **Validación automática** de tipos de IVA (21%, 10%, 4%)
- **Detección de IRPF** en servicios profesionales
- **Verificación de deducibilidad**
- **Clasificación de documentos** (factura vs ticket)

### ✅ PRIORIDAD 4: Exportes Fiscales Españoles

#### Nuevos reportes implementados:
- **📊 Libro de Gastos** (`/export/spain/libro-gastos`)
  - Registro detallado de gastos con campos fiscales
  - Formato CSV con encoding UTF-8
  
- **📊 Libro de Ingresos** (`/export/spain/libro-ingresos`)
  - Registro de ingresos y facturación
  - Control de cobros y fechas
  
- **📊 Modelo 303** (`/export/spain/modelo-303`)
  - Resumen trimestral de IVA
  - Cálculo automático de diferencias
  - Formato JSON estructurado
  
- **📊 Modelo 130** (`/export/spain/modelo-130`)
  - Pago fraccionado trimestral IRPF
  - Cálculo de base imponible
  - Resta automática de retenciones

#### Componente de interfaz:
- **ExportSpainDialog**: Interfaz intuitiva para exportes
- **Selección por año y trimestre**
- **Descripciones explicativas** de cada reporte
- **Descarga automática** de archivos

### ✅ PRIORIDAD 5: Motor de Validación Fiscal

#### Reglas de validación implementadas:
- **✅ NIF/CIF obligatorio**: Validación de formato español
- **✅ Números de factura**: Obligatorio para importes >400€
- **✅ IVA coherente**: Verificación de tipos estándar y cálculos
- **✅ IRPF esperado**: Alerta para servicios profesionales
- **✅ Deducibilidad**: Avisos para gastos cuestionables

#### Características técnicas:
- **Validador TypeScript** con tipos estrictos
- **Hook de React** para uso en frontend
- **Componentes de UI** para mostrar errores/avisos
- **Sistema de puntuación** de salud fiscal
- **Tolerancias de cálculo** para errores de redondeo

#### Validaciones específicas:
- Formato NIF: `12345678A`
- Formato CIF: `B12345678`
- Formato NIE: `X1234567L`
- Tipos IVA: 0%, 4%, 10%, 21%
- IRPF típico: 7%, 15%

## 🚀 Próximos Pasos

1. **Ejecutar migración de base de datos**:
   ```bash
   npx prisma migrate deploy
   ```

2. **Regenerar cliente Prisma**:
   ```bash
   npx prisma generate
   ```

3. **Integrar validaciones** en formularios de transacciones

4. **Añadir exportes** al menú principal de la aplicación

5. **Configurar CI/CD** con nueva imagen Docker

## 📁 Archivos Nuevos Creados

### Exportes fiscales:
- `app/(app)/export/spain/libro-gastos/route.ts`
- `app/(app)/export/spain/libro-ingresos/route.ts`
- `app/(app)/export/spain/modelo-303/route.ts`
- `app/(app)/export/spain/modelo-130/route.ts`
- `components/export/spain-exports.tsx`

### Motor de validación:
- `lib/spanish-tax-validator.ts`
- `hooks/use-spanish-tax-validation.tsx`
- `components/validation/spanish-tax-validation.tsx`

### Base de datos:
- `prisma/migrations/20250319000000_add_spanish_fiscal_fields/migration.sql`

## 🔧 Archivos Modificados

- `prisma/schema.prisma` - Campos fiscales españoles
- `models/defaults.ts` - Categorías y prompt españoles
- `docker-compose.*.yml` - Configuraciones actualizadas
- `package-lock.json` - Branding técnico
- `LICENSE` - Copyright actualizado
- Documentación y configuraciones varias

---

**Status:** ✅ **Todas las prioridades completadas**

La aplicación está ahora completamente adaptada para el mercado español con:
- ✅ Branding correcto
- ✅ Campos fiscales españoles
- ✅ Categorías localizadas  
- ✅ Prompt de IA especializado
- ✅ Exportes oficiales
- ✅ Motor de validación fiscal

¡Listo para desplegar y usar en España! 🇪🇸