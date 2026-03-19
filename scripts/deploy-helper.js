#!/usr/bin/env node

/**
 * 🚀 TaxFlow ES - Script Deploy Rápido
 * Ejecutar: node scripts/deploy-helper.js
 */

console.log('🇪🇸 TaxFlow ES - Deploy Helper')
console.log('='.repeat(50))

console.log('\n🎉 ¡Todas las configuraciones están listas!')
console.log('\n📊 CI/CD configurado:')
console.log('   ✅ GitHub Actions workflows creados')
console.log('   ✅ Tests automáticos funcionalidades españolas')
console.log('   ✅ Build verification en cada push')
console.log('   ✅ Auto-deploy cuando push a main')

console.log('\n🌐 Plataformas de deploy configuradas:')
console.log('   ✅ Vercel (automático via vercel.json)')
console.log('   ✅ Railway (automático via railway.toml)')
console.log('   ✅ Azure App Service (guía completa)')
console.log('   ✅ Docker self-hosted (dockerfile optimizado)')

console.log('\n📚 Documentación completa:')
console.log('   ✅ README.md con todas las funcionalidades')
console.log('   ✅ DEPLOYMENT-GUIDE.md paso a paso')
console.log('   ✅ Health check endpoint: /api/health')

console.log('\n' + '='.repeat(50))
console.log('🚀 OPCIONES DE DEPLOY RÁPIDO')
console.log('='.repeat(50))

console.log('\n1️⃣ VERCEL (Gratis - Recomendado):')
console.log('   🔗 https://vercel.com/new/clone?repository-url=https://github.com/cristianursan81/taxflow-es')
console.log('   📋 Variables necesarias:')
console.log('      • DATABASE_URL: PostgreSQL de Neon/Supabase')
console.log('      • BETTER_AUTH_SECRET: Genera con openssl rand -base64 64')
console.log('      • OPENAI_API_KEY: Tu API key (opcional)')

console.log('\n2️⃣ RAILWAY ($5/mes - Más fácil):')
console.log('   🔗 https://railway.app/template/taxflow-es')
console.log('   📋 Variables automáticas + solo configurar:')
console.log('      • BETTER_AUTH_SECRET: Genera segura')
console.log('      • OPENAI_API_KEY: Opcional')

console.log('\n3️⃣ DOCKER LOCAL (Self-hosted):')
console.log('   💻 Comandos:')
console.log('      git clone https://github.com/cristianursan81/taxflow-es.git')
console.log('      cd taxflow-es')
console.log('      cp .env.example .env  # Editar variables')
console.log('      docker-compose -f docker-compose.production.yml up -d')

console.log('\n4️⃣ AZURE APP SERVICE (Enterprise):')
console.log('   ☁️ Ver guía completa: DEPLOYMENT-GUIDE.md')
console.log('   📋 Incluye setup CLI y configuración completa')

console.log('\n' + '='.repeat(50))
console.log('✅ VERIFICACIÓN POST-DEPLOY')
console.log('='.repeat(50))

console.log('\n🏥 Health Check:')
console.log('   curl https://tu-app.vercel.app/api/health')
console.log('   Debe retornar: {"status": "healthy", "features": {...}}')

console.log('\n🇪🇸 Test Funcionalidades Españolas:')
console.log('   • ✅ Crear transacción con NIF: 12345678Z')
console.log('   • ✅ Verificar cálculo IVA automático (21%)')
console.log('   • ✅ Probar exportación española')
console.log('   • ✅ Validar categorías fiscales')

console.log('\n📊 Monitoring:')
console.log('   • Response time < 500ms')
console.log('   • Uptime > 99.9%')
console.log('   • Error rate < 1%')

console.log('\n' + '='.repeat(50))
console.log('🎯 PRÓXIMOS PASOS RECOMENDADOS')
console.log('='.repeat(50))

console.log('\n📈 Mejoras Opcionales:')
console.log('   • [ ] Configurar dominio personalizado')
console.log('   • [ ] Setup SSL/HTTPS automático')
console.log('   • [ ] Monitoring con Sentry/LogRocket')
console.log('   • [ ] Backup automático database')
console.log('   • [ ] CDN para assets estáticos')

console.log('\n🇪🇸 Funcionalidades Extra España:')
console.log('   • [ ] Modelo 347 (operaciones > 3.005€)')
console.log('   • [ ] Modelo 349 (intracomunitarias UE)')
console.log('   • [ ] SII (Suministro Inmediato Información)')
console.log('   • [ ] Integración API AEAT oficial')

console.log('\n📞 Soporte:')
console.log('   🐛 Issues: https://github.com/cristianursan81/taxflow-es/issues')
console.log('   📖 Docs: README.md + DEPLOYMENT-GUIDE.md')
console.log('   🧪 Tests: node scripts/quick-spanish-test.js')

console.log('\n🎉 ¡TaxFlow ES está listo para el mercado español!')
console.log('🇪🇸 ¡Vamos a revolucionar la contabilidad en España! 🚀')
console.log('='.repeat(50))