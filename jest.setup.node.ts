// Setup for Node.js environment tests (API routes, database operations)

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5433/taxflow-es-test'
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only'

// Mock console methods for cleaner test output
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock Next.js request/response objects
global.Request = class extends Request {
  constructor(input, init) {
    super(input, init)
  }
}

global.Response = class extends Response {
  constructor(body, init) {
    super(body, init)
  }
}