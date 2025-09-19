import '@testing-library/jest-dom'
import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
  // Mock environment variables
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.SUPABASE_URL = 'https://test.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'
})

afterAll(() => {
  // Cleanup
})