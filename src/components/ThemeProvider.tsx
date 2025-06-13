import { ReactNode, createContext } from "react"

export type Theme = "dark"

type ThemeProviderProps = {
  children: ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const root = window.document.documentElement
  root.classList.remove("light")
  root.classList.add("dark")
  const themeColor = "hsl(30 15% 8%)"
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor)

  const value: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export { ThemeProviderContext }
