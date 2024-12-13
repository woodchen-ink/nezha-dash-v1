import { createContext } from "react"

export interface FilterContextType {
  filter: boolean
  setFilter: (filter: boolean) => void
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined)
