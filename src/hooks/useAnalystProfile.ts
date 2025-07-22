import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAnalystProfileData } from '../apis/apiEndpoints'

const useAnalystProfile = (analystId: string, userId:string) => {
    const {
        data: isanalystData,
        isLoading: isanalystDataLoading,
        isError: isanalystDataError
    } = useQuery({
        queryKey: ["analystProfileData", analystId],
        queryFn: () => getAnalystProfileData(analystId),
        enabled: !!userId
    })
    return {
        isanalystData,
        isanalystDataLoading,
        isanalystDataError
    }
}

export default useAnalystProfile