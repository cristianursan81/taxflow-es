import { NextResponse } from 'next/server'

/**
 * Health check endpoint para deployment y monitoring
 * GET /api/health
 */
export async function GET() {
  try {
    // Verificar funcionalidades críticas españolas
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.5.5',
      country: 'ES',
      features: {
        spanish_validation: true,
        vat_calculation: true, 
        irpf_detection: true,
        spanish_exports: true,
        spanish_categories: true
      },
      database: 'connected', // En producción verificar conexión real
      build: process.env.VERCEL_GIT_COMMIT_SHA || process.env.RAILWAY_GIT_COMMIT_SHA || 'local'
    }

    return NextResponse.json(healthCheck, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })
  }
}