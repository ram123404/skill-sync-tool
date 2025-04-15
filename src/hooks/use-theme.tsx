
import * as React from "react"

type Theme = "dark" | "light" | "system"

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "system"
  )

  React.useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      return
    }

    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return { theme, setTheme }
}
