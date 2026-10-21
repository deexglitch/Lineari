import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useApiHealth() {
    return useQuery({
        queryKey: ['health'],
        queryFn: async () => {
            const { data, error } = await api.GET('/health')
            if (error) throw error
            return data
        },
        retry: false,
        refetchInterval: 30_000
    })
}