import createClient from 'openapi-fetch'
import type { paths } from './schema'

// Every call made through this client is checked against the OpenAPI contract.
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})