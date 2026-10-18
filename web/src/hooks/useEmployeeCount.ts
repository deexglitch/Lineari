import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

//small call to prove frontend, api and db are wired correctly
export function useEmployeeCount() {
    return useQuery({
        queryKey: ['employees', 'count'],
        queryFn: async () => {
            const { data, error } = await api.GET('/employees', {
                params: { query: { page_size: 1} }
            })
            if (error) throw error
            return data.total
        }
    })
}