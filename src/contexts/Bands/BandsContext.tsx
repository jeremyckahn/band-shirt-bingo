import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchBands } from '../../services/bandsService'
import { BandsProviderProps, BandsContext } from './BandsProviderProps'

export interface BandsContextType {
  bands: string[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const BandsProvider: React.FC<BandsProviderProps> = ({ children }) => {
  const { data, isLoading, error, refetch } = useQuery({
    // FIXME: Make 'bands' an enum value in an external, centalized types file
    queryKey: ['bands'],
    queryFn: fetchBands,
  })

  const value: BandsContextType = {
    bands: data?.bands || [],
    isLoading,
    error: error as Error | null,
    refetch,
  }

  return <BandsContext.Provider value={value}>{children}</BandsContext.Provider>
}
