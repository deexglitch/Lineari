import createClient, { type Middleware } from 'openapi-fetch'
import { refreshSession } from '@/lib/api'
import type { paths } from './schema'



// An expired access cookie gets one silent refresh, then the read is retried.
const retryAfterRefresh: Middleware = {
  async onResponse({ request, response }) {
    if (response.status !== 401 || request.method !== 'GET') return
    if (request.url.includes('/auth/')) return
    if (!(await refreshSession())) return
    return fetch(request.clone())
  },
}

const base = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const api = createClient<paths>({
  baseUrl: base.startsWith('/') ? window.location.origin + base : base,
  credentials: 'include',
})