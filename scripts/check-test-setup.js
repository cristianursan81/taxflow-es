#!/usr/bin/env node

/**
 * Script para verificar la configuración de testing de TaxFlow-ES
 * Ejecutar con: node scripts/check-test-setup.js
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const requiredFiles = [
  'jest.config.ts',
  'jest.setup.ts', 
  'jest.setup.node.ts',
  'playwright.config.ts',
  'lib/__tests__/spanish-tax-validator.test.ts',
  'components/validation/__tests__/spanish-tax-validation.test.tsx',
  'app/(app)/export/spain/__tests__/spain-exports.api.test.ts',
  'tests/e2e/spanish-features.spec.ts',
  'tests/setup/global-setup.ts',
  'tests/setup/global-teardown.ts'
]

const requiredDependencies = [
  '@jest/types',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  '@types/jest',
  'jest',
  'jest-environment-jsdom',
  'jest-environment-node',
  '@playwright/test',
  'ts-jest'
]

console.log('🧪 TaxFlow-ES Testing Setup Checker\n')

// Verificar archivos requeridos
console.log('📁 Verificando archivos de configuración...')
let missingFiles = []

for (const file of requiredFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - FALTA`)
    missingFiles.push(file)
  }
}

// Verificar package.json
console.log('\n📦 Verificando package.json...')
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  
  // Verificar scripts
  const requiredScripts = [
    'test',
    'test:watch',
    'test:coverage',
    'test:validation',
    'test:exports',
    'test:db',
    'test:e2e'
  ]

  console.log('📜 Scripts de testing:')
  let missingScripts = []
  for (const script of requiredScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`)
    } else {
      console.log(`❌ ${script} - FALTA`)
      missingScripts.push(script)
    }
  }

  // Verificar dependencias
  console.log('\n📚 Dependencias de testing:')
  let missingDeps = []
  for (const dep of requiredDependencies) {
    const inDeps = packageJson.dependencies && packageJson.dependencies[dep]
    const inDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep]
    
    if (inDeps || inDevDeps) {
      const version = inDeps || inDevDeps
      console.log(`✅ ${dep}: ${version}`)
    } else {
      console.log(`❌ ${dep} - FALTA`)
      missingDeps.push(dep)
    }
  }

  // Verificar que Node.js esté instalado
  console.log('\n🟢 Verificando entorno...')
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim()
    console.log(`✅ Node.js: ${nodeVersion}`)
  } catch {
    console.log('❌ Node.js no encontrado')
  }

  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
    console.log(`✅ npm: ${npmVersion}`)
  } catch {
    console.log('❌ npm no encontrado')
  }

  // Verificar conexión de base de datos (si está disponible)
  console.log('\n🗄️  Verificando base de datos de testing...')
  try {
    // Verificar si PostgreSQL está corriendo
    execSync('pg_isready -h localhost -p 5433', { stdio: 'ignore' })
    console.log('✅ Base de datos de testing disponible (puerto 5433)')
  } catch {
    console.log('⚠️  Base de datos de testing no disponible en puerto 5433')
    console.log('   Puedes iniciarla con: docker run --name taxflow-test-db -e POSTGRES_DB=taxflow-es-test -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -p 5433:5432 -d postgres:15')
  }

  // Resumen
  console.log('\n📊 RESUMEN:')
  const totalIssues = missingFiles.length + missingScripts.length + missingDeps.length
  
  if (totalIssues === 0) {
    console.log('🎉 ¡Configuración de testing completa!')
    console.log('\nPuedes ejecutar:')
    console.log('  npm test                 - Tests unitarios')
    console.log('  npm run test:coverage    - Tests con coverage')
    console.log('  npm run test:e2e         - Tests end-to-end')
  } else {
    console.log(`❌ Encontrados ${totalIssues} problemas:`)
    
    if (missingFiles.length > 0) {
      console.log(`\n📁 Archivos faltantes (${missingFiles.length}):`)
      missingFiles.forEach(file => console.log(`   - ${file}`))
    }
    
    if (missingScripts.length > 0) {
      console.log(`\n📜 Scripts faltantes (${missingScripts.length}):`)
      missingScripts.forEach(script => console.log(`   - ${script}`))
    }
    
    if (missingDeps.length > 0) {
      console.log(`\n📚 Dependencias faltantes (${missingDeps.length}):`)
      missingDeps.forEach(dep => console.log(`   - ${dep}`))
      console.log('\nPara instalarlas: npm install --save-dev ' + missingDeps.join(' '))
    }
  }

} catch (error) {
  console.error('❌ Error leyendo package.json:', error.message)
}

console.log('\n📖 Para más información, consulta: TESTING-GUIDE.md')