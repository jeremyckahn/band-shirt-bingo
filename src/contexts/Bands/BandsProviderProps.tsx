import { createContext, ReactNode } from 'react'
import { BandsContextType } from './BandsContext'

export const BandsContext = createContext<BandsContextType | undefined>(
  undefined
)
export interface BandsProviderProps {
  children: ReactNode
}
