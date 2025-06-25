import { bands } from '../data/bands'

// Simulate API delay
const SIMULATED_DELAY = 1500

export interface BandsResponse {
  bands: string[]
}

export const fetchBands = async (): Promise<BandsResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY))

  // Simulate potential API failure (uncomment to test error states)
  // if (Math.random() < 0.1) {
  //   throw new Error('Failed to fetch bands data')
  // }

  return {
    bands: [...bands], // Return a copy to simulate real API response
  }
}
