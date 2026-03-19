import { PrismaClient } from '@prisma/client'

async function globalTeardown() {
  console.log('🧹 Limpiando entorno de testing...')

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5433/taxflow-es-test'
        }
      }
    })

    // Limpiar datos de prueba
    await prisma.transaction.deleteMany()
    await prisma.category.deleteMany()
    await prisma.project.deleteMany()
    await prisma.field.deleteMany()
    await prisma.user.deleteMany()

    await prisma.$disconnect()

    console.log('✅ Limpieza completada')
  } catch (error) {
    console.error('❌ Error en limpieza:', error)
    // No lanzar error para no interrumpir otros procesos
  }
}

export default globalTeardown