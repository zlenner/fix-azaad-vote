import createStateContext from 'react-use/lib/factory/createStateContext'
import { Seat } from './useLoadData'

export interface Selected {
  national?: Seat
  provincial?: Seat
  primary: 'national' | 'provincial' | false
}

export interface Data {
  seats: Record<string, Seat>
  issues: {
    problematicSeats: string[]
    knownIssues: string[]
  }
}

const [useSharedState, SharedStateProvider] = createStateContext<Data>(
  undefined as any
)

export const DataProvider = SharedStateProvider
export const useData = useSharedState
