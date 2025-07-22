import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getLatestTrade } from '../apis/apiEndpoints'

const useLatestTrades = (userId: string) => {
    const {
        data: latestTradesData,
        isLoading: latestTradesLoading,
        isError: latestTradesError,

    } = useQuery({
        queryKey: ['LatestTrades'],
        queryFn: () => getLatestTrade(),
        enabled: !!userId,
    })
    return {
        latestTradesData,
        latestTradesLoading,
        latestTradesError,
    }
}

export default useLatestTrades