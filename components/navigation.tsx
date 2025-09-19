'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth/context'
import { useTheme } from '@/lib/theme-context'
import { useToast } from '@/components/ui/toast'
import { 
  Users, 
  Search, 
  Briefcase, 
  Plus, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sparkles,
  Zap,
  Heart,
  Bell,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'

export function Navigation() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { addToast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationCount] = useState(3) // Demo notification count
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      default:
        return Monitor
    }
  }

  const handleNotificationClick = () => {
    // Demo notifications
    const notifications = [
      'New proposal received on "E-commerce Website"',
      'Message from Alice Johnson',
      'Job "Brand Identity Design" has been completed'
    ]
    
    notifications.forEach((message, index) => {
      setTimeout(() => {
        addToast({
          type: 'info',
          title: 'Notification',
          description: message,
          duration: 4000
        })
      }, index * 500)
    })
  }

  const publicNavItems = [
    { href: '/about', label: 'About', icon: Heart },
    { href: '/help', label: 'Help', icon: MessageSquare },
  ]

  const authenticatedNavItems = [
    { href: '/jobs', label: 'Find Work', icon: Search },
    { href: '/jobs/new', label: 'Post Job', icon: Plus },
    { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <>
      {/* Premium backdrop blur effect */}
      <div className="fixed top-0 left-0 right-0 z-40 h-20 bg-gradient-to-b from-white/95 to-white/85 dark:from-slate-900/95 dark:to-slate-900/85 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 shadow-lg shadow-blue-500/5 dark:shadow-slate-900/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 dark:from-blue-400/5 dark:via-transparent dark:to-purple-400/5" />
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with premium styling */}
            <Link 
              href="/" 
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-75 blur-sm transition-all duration-300" />
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="h-6 w-6 transition-transform group-hover:scale-110" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  tykoonConnect
                </h1>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                  100% Free
                </Badge>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  {/* Authenticated Navigation */}
                  {authenticatedNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-inner'
                            : 'text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-4 w-4 transition-all duration-300 ${
                            isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                          }`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive(item.href) && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                        )}
                      </Link>
                    )
                  })}
                  
                  {/* User Menu */}
                  <div className="ml-6 flex items-center space-x-3">
                    {/* Theme Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="relative p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group"
                      title={`Current theme: ${theme} (click to cycle)`}
                    >
                      {(() => {
                        const IconComponent = getThemeIcon()
                        return <IconComponent className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:scale-110 transition-transform" />
                      })()}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNotificationClick}
                      className="relative p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group"
                      title="View notifications"
                    >
                      <Bell className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:scale-110 transition-transform" />
                      {notificationCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 rounded-full p-0 flex items-center justify-center animate-pulse"
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                    
                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-12 w-auto px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-left">
                              <div className="font-medium text-gray-900 dark:text-slate-100">
                                {user?.user_metadata?.name || 'Demo User'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">
                                @{user?.user_metadata?.handle || 'demouser'}
                              </div>
                            </div>
                            
                            <div className="relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-75 blur transition-all duration-300" />
                              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64 p-2" align="end">
                        <DropdownMenuLabel className="font-semibold text-base">
                          {user?.user_metadata?.name || 'Demo User'}
                        </DropdownMenuLabel>
                        <div className="px-2 pb-2 text-xs text-gray-500">
                          @{user?.user_metadata?.handle || 'demouser'}
                        </div>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="flex items-center cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="flex items-center cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center cursor-pointer">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link href="/messages" className="flex items-center cursor-pointer">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Messages
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                          onClick={signOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <>
                  {/* Public Navigation */}
                  {publicNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30'
                            : 'text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                  
                  <div className="ml-6 flex items-center space-x-3">
                    {/* Theme Toggle for public users */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="relative p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group"
                      title={`Current theme: ${theme} (click to cycle)`}
                    >
                      {(() => {
                        const IconComponent = getThemeIcon()
                        return <IconComponent className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:scale-110 transition-transform" />
                      })()}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      asChild
                      className="relative overflow-hidden group border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      <Link href="/auth/signin">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        <span className="relative">Sign In</span>
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild
                      className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/auth/signup">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        <Zap className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                        <span className="relative">Get Started</span>
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Theme Toggle for Mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group"
                title={`Current theme: ${theme} (click to cycle)`}
              >
                {(() => {
                  const IconComponent = getThemeIcon()
                  return <IconComponent className="h-5 w-5 text-gray-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                })()}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6 text-gray-600 dark:text-slate-300" /> : <Menu className="h-6 w-6 text-gray-600 dark:text-slate-300" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  {authenticatedNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30'
                            : 'text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  <div className="border-t pt-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {publicNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-300"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  <div className="border-t pt-4 mt-4 space-y-3">
                    <Button 
                      variant="outline" 
                      asChild
                      className="w-full"
                    >
                      <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                    >
                      <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                        <Zap className="mr-2 h-4 w-4" />
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}