'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Handle system theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      if (theme === 'system') {
        setActualTheme(systemTheme)
        updateDOM(systemTheme)
      }
    }

    // Set initial system theme
    updateSystemTheme()
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateSystemTheme)
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [theme])

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme)
        
        if (savedTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          setActualTheme(systemTheme)
          updateDOM(systemTheme)
        } else {
          setActualTheme(savedTheme)
          updateDOM(savedTheme)
        }
      } else {
        // Default to system theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        setActualTheme(systemTheme)
        updateDOM(systemTheme)
      }
    } catch (error) {
      // If localStorage fails, fall back to system theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setActualTheme(systemTheme)
      updateDOM(systemTheme)
    }
  }, [])

  // Update DOM and localStorage when theme changes
  const updateDOM = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(newTheme)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#ffffff')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.warn('Failed to save theme preference to localStorage')
    }

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setActualTheme(systemTheme)
      updateDOM(systemTheme)
    } else {
      setActualTheme(newTheme)
      updateDOM(newTheme)
    }
  }

  // Prevent hydration mismatch by not rendering children until mounted
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for getting theme-aware classes
export function useThemeClasses() {
  const { actualTheme } = useTheme()
  
  return {
    background: actualTheme === 'dark' ? 'bg-slate-900' : 'bg-white',
    foreground: actualTheme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    muted: actualTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600',
    card: actualTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
    accent: actualTheme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200',
    border: actualTheme === 'dark' ? 'border-slate-700' : 'border-slate-200',
  }
}