# 🇪🇸 TaxFlow ES - Contabilidad Inteligente para España

[![Version](https://img.shields.io/badge/version-0.5.5-blue.svg)](https://github.com/cristianursan81/taxflow-es)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)

**TaxFlow ES** es una aplicación de contabilidad con IA **específicamente adaptada para el mercado español**. Automatiza la gestión fiscal de autónomos y pymes con validación inteligente de NIF/CIF, cálculo automático de IVA e IRPF, y exportaciones en formato oficial español.

🔥 **Funcionalidades exclusivas para España:**
- ✅ **Validación automática** NIF, CIF y NIE españoles
- ✅ **Cálculo inteligente** de IVA (21%, 10%, 4%) con verificación
- ✅ **Detección IRPF** automática para servicios profesionales
- ✅ **Exportaciones oficiales**: Libro de Gastos, Modelo 303, Modelo 130
- ✅ **16 categorías fiscales** específicas para empresas españolas
- ✅ **Validación en tiempo real** con avisos fiscales inteligentes

---

## 🚀 **Características Principales**

### **🧮 Validación Fiscal Automática**
- **NIF/CIF/NIE**: Validación automática con regex españolas oficiales
- **IVA inteligente**: Cálculo y verificación automática de importes IVA
- **IRPF profesionales**: Detecta servicios que requieren retención (15%)
- **Avisos fiscales**: Sistema inteligente de warnings y errores

### **📊 Exportaciones Españolas Oficiales**
- **📋 Libro de Gastos**: CSV con formato oficial Hacienda
- **📈 Libro de Ingresos**: CSV para declaraciones trimestrales  
- **🧾 Modelo 303**: JSON para declaración IVA trimestral
- **📊 Modelo 130**: JSON para autónomos IRPF trimestral

### **🏷️ Categorías Fiscales Españolas**
16 categorías preconfiguradas específicas para España:
- Suministros y materiales
- Software y suscripciones  
- Telecomunicaciones
- Servicios profesionales (con IRPF)
- Dietas y restauración
- Y muchas más...

### **🤖 IA Integrada**
- **Análisis automático** de facturas y tickets
- **Extracción inteligente** de datos (NIF, IVA, importes)
- **Múltiples proveedores**: OpenAI, Groq, Mistral, Google Gemini
- **Categorización automática** según normativa española

---

## 🛠️ **Tecnologías**

- **Frontend**: Next.js 15.5 + React 19 + TypeScript
- **Base de datos**: Prisma ORM (SQLite/PostgreSQL)
- **IA**: LangChain con múltiples proveedores LLM
- **UI**: Tailwind CSS + Radix UI + Lucide Icons
- **Testing**: Jest + Playwright + Testing Library
- **Deploy**: Docker + Docker Compose ready

---

## 🏃‍♂️ **Instalación Rápida**

### **1. Clona el proyecto**
```bash
git clone https://github.com/cristianursan81/taxflow-es.git
cd taxflow-es
```

### **2. Instala dependencias**
```bash
npm install --legacy-peer-deps
```

### **3. Configura variables de entorno**
```bash
# Copia y edita las variables de entorno
cp .env.example .env.local

# Edita .env.local con tus configuraciones:
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="tu-clave-secreta"
OPENAI_API_KEY="sk-tu-api-key-aqui"  # Opcional
```

### **4. Configura base de datos**
```bash
# Genera cliente Prisma
npx prisma generate

# Ejecuta migraciones
npx prisma migrate dev --name init

# (Opcional) Poblar con datos españoles de ejemplo
node scripts/seed-spanish-data.js
```

### **5. Arrancar aplicación**
```bash
npm run dev
```

🌐 **Aplicación disponible en:** http://localhost:3000

---

## 🧪 **Testing**

TaxFlow ES incluye una **suite completa de tests** específicos para funcionalidades españolas:

### **Tests Rápidos**
```bash
# Test rápido de funcionalidades españolas
node scripts/quick-spanish-test.js

# Demostración completa
node scripts/demo-spanish-features.js
```

### **Tests Completos**
```bash
# Tests unitarios
npm test

# Tests específicos
npm test spanish-tax-validator    # Validación fiscal
npm test spanish-tax-validation   # Componentes UI
npm test spain-exports           # Exportaciones

# Tests E2E
npm run test:e2e
```

### **Cobertura Testing**
- ✅ **Validación NIF/CIF/NIE** (100+ casos test)
- ✅ **Cálculo IVA** (todos los tipos: 21%, 10%, 4%)
- ✅ **Detección IRPF** (servicios profesionales)
- ✅ **Exportaciones** (CSV y JSON oficiales)
- ✅ **Componentes React** (UI validation)
- ✅ **Flujos E2E** (user workflows completos)

---

## 🌐 **Deployment Production**

### **🐳 Docker (Recomendado)**
```bash
# Build y deploy con Docker
docker-compose -f docker-compose.production.yml up -d

# O desarrollo local
docker-compose up -d
```

### **☁️ Deploy Platforms**
- **Vercel**: Configuración incluida (zero-config)
- **Azure App Service**: Compatible out-of-the-box
- **Railway**: Un-click deploy ready
- **Digital Ocean**: Droplet + Docker setup

### **🗄️ Bases de Datos Soportadas**
- **SQLite**: Para desarrollo y proyectos pequeños
- **PostgreSQL**: Para producción (recomendado)
- **MySQL**: Compatible con Prisma

---

## 📚 **Documentación**

### **Guías Específicas**
- 📖 [**ADAPTACION-ESPANA.md**](./ADAPTACION-ESPANA.md) - Guía completa adaptación española
- 🧪 [**TESTING-GUIDE.md**](./TESTING-GUIDE.md) - Manual testing exhaustivo
- 🏃‍♂️ **Scripts incluidos**: Tests rápidos y demos

### **Validaciones Fiscales Soportadas**
- **NIF**: Personas físicas (`12345678Z`)
- **CIF**: Personas jurídicas (`B87654321`)  
- **NIE**: Extranjeros residentes (`X1234567L`)
- **IVA**: Tipos 21%, 10%, 4% + validación cálculos
- **IRPF**: Detección automática servicios profesionales

### **Exportaciones Disponibles**
- **Libro de Gastos**: CSV Hacienda-compliant
- **Libro de Ingresos**: CSV para autónomos
- **Modelo 303**: JSON declaración IVA trimestral
- **Modelo 130**: JSON autónomos IRPF

---

## 🔐 **Seguridad & Privacidad**

- ✅ **100% Self-hosted**: Todos tus datos permanecen en tu servidor
- ✅ **No tracking**: Sin Google Analytics o tracking externo
- ✅ **Encriptación**: Datos sensibles encriptados
- ✅ **RGPD compliant**: Cumple normativa europea privacidad
- ✅ **Opcional IA**: Funcionalidades IA són opcionales

---

## 🤝 **Contribuir**

¡Las contribuciones son bienvenidas! Especialmente para:

- 🇪🇸 **Mejoras fiscales españolas**: Nuevos modelos, validaciones
- 🌍 **Localizaciones**: ¿Adaptar a otros países?
- 🧪 **Testing**: Más casos edge españoles
- 📚 **Documentación**: Guías y tutoriales

### **Cómo contribuir**
1. Fork del proyecto
2. Crea feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📊 **Roadmap Español**

- [ ] **Modelo 347**: Operaciones > 3.005,06€
- [ ] **Modelo 349**: Operaciones intracomunitarias UE
- [ ] **SII**: Suministro Inmediato Información (facturas online)
- [ ] **Integración AEAT**: API oficial Hacienda  
- [ ] **Facturación electrónica**: Generación facturas oficiales
- [ ] **Multi-empresa**: Gestión múltiples empresas/autónomos

---

## ⚖️ **Disclaimer Legal**

⚠️ **TaxFlow ES es una herramienta de gestión contable**. No sustituye el asesoramiento fiscal profesional. Consulta siempre con un asesor fiscal certificado para:

- Declaraciones oficiales Hacienda
- Interpretación normativa fiscal
- Casos complejos o atípicos
- Optimización fiscal legal

---

## 📄 **Licencia**

Este proyecto está bajo licencia **MIT** - ver [LICENSE](LICENSE) para detalles.

**Libre uso comercial y personal** ✅

---

## 🙏 **Créditos**

Desarrollado con ❤️ para la **comunidad de autónomos y pymes españolas**.

**¿Te gusta el proyecto? ⭐ Danos una estrella en GitHub!**

---

<div align="center">

### 📞 **Soporte & Comunidad**

[🐛 Reportar Bug](https://github.com/cristianursan81/taxflow-es/issues) • 
[💡 Sugerir Feature](https://github.com/cristianursan81/taxflow-es/issues) • 
[📖 Documentación](./ADAPTACION-ESPANA.md) •
[🧪 Testing Guide](./TESTING-GUIDE.md)

**¡TaxFlow ES - La solución fiscal inteligente hecha para España! 🇪🇸**

</div>
