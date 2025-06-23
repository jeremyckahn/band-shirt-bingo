import { useContext } from 'react'
import { BandsContextType } from './BandsContext'
import { BandsContext } from './BandsProviderProps'

export const useBands = (): BandsContextType => {
  const context = useContext(BandsContext)
  if (context === undefined) {
    throw new Error('useBands must be used within a BandsProvider')
  }
  return context
}
