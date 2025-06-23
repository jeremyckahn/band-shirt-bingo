import React from 'react'
import { bands } from '../../data/bands'
import { BandsProviderProps, BandsContext } from './BandsProviderProps'

export interface BandsContextType {
  bands: string[]
}

export const BandsProvider: React.FC<BandsProviderProps> = ({ children }) => {
  const value: BandsContextType = {
    bands,
  }

  return <BandsContext.Provider value={value}>{children}</BandsContext.Provider>
}
