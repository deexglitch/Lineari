import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

const PAGE_SIZE = 100

async function fetchPage(page: number) {
  const { data, error } = await api.GET('/employees', {
    params: { query: { page, page_size: PAGE_SIZE } },
  })
  if (error) throw error
  return data
}

type Page = Awaited<ReturnType<typeof fetchPage>>

/** Loads every employee, page by page, from the API. Nothing is mocked or cached locally. */
export function useEmployees() {
  return useQuery({
    queryKey: ['employees', 'all'],
    queryFn: async () => {
      const all: Page['items'] = []
      let page = 1
      let total = Number.POSITIVE_INFINITY

      while (all.length < total) {
        const result = await fetchPage(page)
        total = result.total
        if (result.items.length === 0) break
        all.push(...result.items)
        page += 1
      }
      return all
    },
  })
}