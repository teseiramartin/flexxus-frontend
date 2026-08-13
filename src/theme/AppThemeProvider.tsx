'use client'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
type ThemeMode = 'light' | 'dark'
type ThemeContextValue = { mode: ThemeMode; toggleTheme: () => void }
const ThemeModeContext = createContext<ThemeContextValue | null>(null)
export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light')
  useEffect(() => {
    const storedMode = window.localStorage.getItem('flexxus:theme') as ThemeMode | null
    const initialMode = storedMode ?? 'light'
    document.documentElement.dataset.theme = initialMode
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(initialMode)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = mode
    window.localStorage.setItem('flexxus:theme', mode)
  }, [mode])
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'dark' ? '#7ca7e8' : '#0d2d5d' },
          background: {
            default: mode === 'dark' ? '#0c1422' : '#f5f7fb',
            paper: mode === 'dark' ? '#152033' : '#ffffff'
          },
          text: {
            primary: mode === 'dark' ? '#e7edf7' : '#172b4d',
            secondary: mode === 'dark' ? '#a8b3c5' : '#667085'
          }
        },
        typography: { fontFamily: 'var(--font-inter), Arial, sans-serif' }
      }),
    [mode]
  )
  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () => setMode((current) => (current === 'light' ? 'dark' : 'light'))
    }),
    [mode]
  )
  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
export function useThemeMode() {
  const context = useContext(ThemeModeContext)
  if (!context) throw new Error('useThemeMode must be used within AppThemeProvider')
  return context
}
