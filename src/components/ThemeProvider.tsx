import { ReactNode, createContext } from "react"

export type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const root = window.document.documentElement
  root.classList.remove("dark")
  root.classList.add("light")
  const themeColor = "hsl(36 8% 97%)"
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor)

  const value: ThemeProviderState = {
    theme: "light",
    setTheme: () => null,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export { ThemeProviderContext }
