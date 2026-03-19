# 🧪 Guía de Testing para TaxFlow-ES

Esta guía te ayuda a ejecutar todos los tipos de tests configurados para TaxFlow-ES, especialmente para las funcionalidades fiscales españolas.

## 📋 Tipos de Testing Disponibles

### 1. **Tests Unitarios** - Validaciones fiscales y lógica de negocio
### 2. **Tests de Integración** - APIs y base de datos 
### 3. **Tests de Componentes** - Interfaz de usuario React
### 4. **Tests E2E** - Flujos completos de usuario

---

## ⚙️ Configuración Inicial

### 1. Instalar dependencias de testing

```bash
npm install
```

### 2. Configurar base de datos de testing

```bash
# Crear base de datos de test (PostgreSQL)
createdb taxflow-es-test -U postgres

# O usando Docker
docker run --name taxflow-test-db -e POSTGRES_DB=taxflow-es-test -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -p 5433:5432 -d postgres:15
```

### 3. Configurar variables de entorno para testing

Crear archivo `.env.test`:

```env
NODE_ENV=test
DATABASE_URL="postgresql://test:test@localhost:5433/taxflow-es-test"
BETTER_AUTH_SECRET="test-secret-key-for-testing-only"
BASE_URL="http://localhost:7331"
```

---

## 🏃‍♂️ Ejecutar Tests

### Tests Unitarios

```bash
# Todos los tests unitarios
npm run test

# Con watch mode (observa cambios)
npm run test:watch

# Solo validaciones fiscales españolas
npm run test:validation

# Con coverage report
npm run test:coverage
```

### Tests de API y Base de Datos

```bash
# Tests de endpoints de exportes españoles
npm run test:exports

# Tests de integración con base de datos
npm run test:db
```

### Tests de Componentes React

```bash
# Tests de componentes de validación
npm test -- --testPathPattern=components

# Tests específicos de validación española
npm test -- --testPathPattern=spanish-tax-validation
```

### Tests End-to-End (E2E)

```bash
# Instalar Playwright (primera vez)
npx playwright install

# Ejecutar todos los E2E tests
npm run test:e2e

# Solo en Chrome
npx playwright test --project=chromium

# Modo interactivo (debug)
npx playwright test --ui

# Con reporte HTML
npx playwright test --reporter=html
```

---

## 🔍 Tests Específicos para España

### Validador Fiscal Español

```bash
# Test completo del validador
npm test lib/__tests__/spanish-tax-validator.test.ts

# Solo validación de NIF/CIF
npm test -- --testNamePattern="NIF/CIF"
```

### Exportes Fiscales

```bash
# Tests de todos los exports españoles
npm test app/\(app\)/export/spain/__tests__

# Solo Libro de Gastos
npm test -- --testNamePattern="Libro de Gastos"

# Solo Modelos 303 y 130
npm test -- --testNamePattern="Modelo"
```

### Componentes de Validación

```bash
# Tests de componentes de validación
npm test components/validation/__tests__
```

---

## 🎯 Casos de Prueba Clave

### 1. Validación de NIF/CIF
- ✅ Formatos válidos: `12345678Z`, `B12345678`, `X1234567L`
- ❌ Formatos inválidos: `INVALID123`, `123`, vacío

### 2. Cálculo de IVA
- ✅ IVA 21%: Base 100€ → IVA 21€ → Total 121€
- ✅ IVA 10%: Base 100€ → IVA 10€ → Total 110€
- ❌ IVA incorrecto: Base 100€, IVA 21% → IVA 15€ (error)

### 3. Detección de IRPF
- ✅ Servicios profesionales + NIF español → Sugerencia IRPF 15%
- ✅ Arrendamientos → Sugerencia IRPF 21%

### 4. Exportes Fiscales
- ✅ Libro de Gastos: CSV con campos españoles
- ✅ Modelo 303: JSON con cálculos de IVA trimestrales
- ✅ Modelo 130: JSON con pago fraccionado IRPF

---

## 📊 Reports y Coverage

### Coverage Report

```bash
npm run test:coverage
```

Abre `coverage/lcov-report/index.html` para ver el reporte detallado.

### Playwright Reports

```bash
# Después de ejecutar E2E tests
npx playwright show-report
```

---

## 🐛 Debugging Tests

### Jest Debugging

```bash
# Debug con Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug específico
npm test -- --testNamePattern="NIF validation" --verbose
```

### Playwright Debugging

```bash
# Modo debug interactivo
npx playwright test --debug

# Con DevTools
npx playwright test --debug --project=chromium

# Screenshots en fallos
npx playwright test --screenshot=only-on-failure
```

---

## ✅ Lista de Verificación Para PRs

Antes de enviar código, ejecuta:

```bash
# 1. Linting
npm run lint

# 2. Tests unitarios completos
npm run test:coverage

# 3. Tests de exportes españoles
npm run test:exports

# 4. Tests E2E críticos
npx playwright test tests/e2e/spanish-features.spec.ts

# 5. Verificar builds
npm run build
```

---

## 🚨 Solución de Problemas

### Error: "Base de datos no encontrada"

```bash
# Recrear base de datos de test
dropdb taxflow-es-test -U postgres
createdb taxflow-es-test -U postgres
npm run test
```

### Error: "Puerto 7331 ocupado"

```bash
# Cambiar puerto para testing
export BASE_URL=http://localhost:3001
npm run dev -- --port 3001
```

### Tests E2E fallan

```bash
# Verificar que la app está ejecutándose
curl http://localhost:7331

# Reinstalar Playwright
npx playwright install --force
```

---

## 📈 Métricas de Testing

### Objetivos de Coverage
- **Validador fiscal**: >95%
- **Exportes**: >90%
- **Componentes UI**: >85%
- **APIs**: >90%

### Performance E2E
- **Load time**: <3s
- **Export download**: <5s
- **Form validation**: <500ms

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - run: npm run test:e2e
```

---

## 📚 Recursos Adicionales

- **Jest Documentation**: https://jestjs.io/docs/
- **Testing Library**: https://testing-library.com/docs/
- **Playwright**: https://playwright.dev/docs/
- **Prisma Testing**: https://www.prisma.io/docs/guides/testing

---

## 🆘 Soporte

Si tienes problemas con los tests:

1. **Revisa los logs detallados**
2. **Verifica la configuración de la base de datos**
3. **Asegúrate de que todas las dependencias están instaladas**
4. **Consulta la documentación específica de cada herramienta**

¡Happy Testing! 🎉