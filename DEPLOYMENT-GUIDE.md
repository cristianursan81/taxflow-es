# 🚀 Guía de Deployment - TaxFlow ES

Esta guía explica cómo deployar TaxFlow ES en diferentes plataformas con funcionalidades españolas completas.

## 📋 Requisitos Previos

### **Variables de Entorno Requeridas:**
```bash
DATABASE_URL="postgresql://user:pass@host:port/dbname"  # PostgreSQL para producción
BETTER_AUTH_SECRET="tu-clave-super-secreta-64-caracteres-minimo"
OPENAI_API_KEY="sk-tu-api-key-aqui"  # Opcional, para IA
NODE_ENV="production"
```

### **Funcionalidades que Deben Funcionar:**
- ✅ Validación NIF/CIF/NIE automática
- ✅ Cálculo IVA (21%, 10%, 4%)
- ✅ Detección IRPF servicios profesionales  
- ✅ Exportaciones españolas (CSV/JSON)
- ✅ 16 categorías fiscales españolas

---

## 🌐 **Vercel (Recomendado - Gratis)**

### **1. Setup Automático:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cristianursan81/taxflow-es)

### **2. Setup Manual:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel --prod

# Configurar variables de entorno en dashboard Vercel:
# DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY
```

### **3. Variables de Entorno (Vercel Dashboard):**
- `DATABASE_URL`: PostgreSQL connection string de tu provider
- `BETTER_AUTH_SECRET`: Genera con: `openssl rand -base64 64`
- `OPENAI_API_KEY`: Tu API key de OpenAI (opcional)

### **4. Base de Datos Recomendadas:**
- **Neon** (PostgreSQL gratis): https://neon.tech
- **Supabase** (PostgreSQL gratis): https://supabase.com
- **PlanetScale** (MySQL compatible): https://planetscale.com

---

## 🚂 **Railway (Fácil - $5/mes)**

### **1. Deploy One-Click:**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/taxflow-es)

### **2. Setup Manual:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y deploy
railway login
railway link [tu-proyecto-id]
railway up

# Agregar PostgreSQL automática
railway add postgresql
```

### **3. Variables Automáticas (Railway)**
Railway configura automáticamente:
- `DATABASE_URL`: PostgreSQL interno
- `PORT`: Puerto automático
- `NODE_ENV=production`

**Solo necesitas configurar:**
- `BETTER_AUTH_SECRET`: Genera segura
- `OPENAI_API_KEY`: Opcional

---

## ☁️ **Azure App Service**

### **1. Azure CLI Setup:**
```bash
# Instalar Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login 
az login

# Crear resource group
az group create --name taxflow-es-rg --location "West Europe"

# Crear App Service plan
az appservice plan create --name taxflow-es-plan --resource-group taxflow-es-rg --sku B1 --is-linux

# Crear web app
az webapp create --resource-group taxflow-es-rg --plan taxflow-es-plan --name tu-taxflow-es --runtime "NODE|18-lts" --deployment-source-url https://github.com/tu-usuario/taxflow-es
```

### **2. Variables de Entorno (Azure Portal):**
```bash
# Configurar via Azure CLI
az webapp config appsettings set --resource-group taxflow-es-rg --name tu-taxflow-es --settings DATABASE_URL="tu-postgresql-url" BETTER_AUTH_SECRET="tu-secret"
```

---

## 🐳 **Docker Self-Hosted**

### **1. Clone y Build:**
```bash
git clone https://github.com/cristianursan81/taxflow-es.git
cd taxflow-es

# Editar .env con tus variables
cp .env.example .env
nano .env

# Build y deploy
docker-compose -f docker-compose.production.yml up -d
```

### **2. Docker Compose Producción:**
```yaml
# docker-compose.production.yml ya configurado
# Incluye: PostgreSQL, Redis, TaxFlow ES
# Configurar en .env:
DATABASE_URL="postgresql://taxflow:password@postgres:5432/taxflow_es"
BETTER_AUTH_SECRET="tu-secret-super-largo"
```

### **3. Verificar Deploy:**
```bash
# Verificar contenedores
docker ps

# Ver logs
docker-compose logs -f taxflow-es

# Health check
curl http://localhost:3000/api/health
```

---

## 🔧 **Configuración Post-Deploy**

### **1. Verify Spanish Features:**
Visita: `https://tu-app.com/api/health`

Debe retornar:
```json
{
  "status": "healthy",
  "features": {
    "spanish_validation": true,
    "vat_calculation": true,
    "irpf_detection": true,
    "spanish_exports": true
  }
}
```

### **2. Poblar con Datos Españoles:**
```bash
# Conectar a tu app deployed
npm install @prisma/client
npx prisma migrate deploy
node scripts/seed-spanish-data.js
```

### **3. Test Funcionalidades:**
- ✅ Crear transacción con NIF: `12345678Z`
- ✅ Verificar cálculo IVA automático (21%)
- ✅ Probar exportación española
- ✅ Validar categorías fiscales españolas

---

## 📊 **Monitoring & Logs**

### **Health Checks:**
- **Endpoint**: `/api/health`
- **Frequency**: Cada 30 segundos
- **Expected**: Status 200 + "healthy"

### **Logs Importantes:**
- Errores validación NIF/CIF
- Fallos cálculo IVA
- Errores exportación
- Performance API calls

### **Métricas Clave:**
- Response time `/api/health` < 500ms
- Error rate transacciones < 1%
- Uptime > 99.9%

---

## 🚨 **Troubleshooting**

### **Error: Validación NIF/CIF no funciona**
```bash
# Verificar funcionalidades españolas
node scripts/quick-spanish-test.js

# Debe mostrar todos ✅
```

### **Error: IVA mal calculado**
- Verificar formato importes (céntimos: 10000 = 100€)
- Comprobar tipos IVA: 21%, 10%, 4%

### **Error: Exportaciones vacías**
- Verificar transacciones tienen campos españoles
- Comprobar base de datos tiene columnas: `supplierTaxId`, `vatRate`, etc.

### **Error: Deploy falla**
- Revisar variables entorno configuradas
- Verificar `DATABASE_URL` válida
- Comprobar `BETTER_AUTH_SECRET` > 32 caracteres

---

## ✅ **Checklist Post-Deploy**

- [ ] ✅ Health check responde OK
- [ ] 🇪🇸 Validación NIF/CIF funciona
- [ ] 💰 Cálculo IVA automático OK  
- [ ] 📊 IRPF se detecta correctamente
- [ ] 📋 Exportaciones descargan archivos
- [ ] 🏷️ 16 categorías españolas disponibles
- [ ] 🔐 Variables entorno configuradas
- [ ] 📈 Monitoring configurado
- [ ] 🗄️ Base datos con datos iniciales
- [ ] 🧪 Tests automáticos pasando

---

## 📞 **Soporte Deploy**

¿Problemas con el deployment?

1. 🔍 **Revisar logs** de plataforma
2. 🧪 **Ejecutar tests**: `node scripts/quick-spanish-test.js`
3. 🏥 **Health check**: `curl tu-app.com/api/health`
4. 🐛 **Crear issue**: [GitHub Issues](https://github.com/cristianursan81/taxflow-es/issues)

**¡TaxFlow ES listo para España! 🇪🇸🚀**