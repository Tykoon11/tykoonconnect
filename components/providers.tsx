'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { AuthProvider } from '@/lib/auth/context'
import { ThemeProvider } from '@/lib/theme-context'
import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  // Only load PayPal if we have a valid client ID
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const hasValidPayPal = paypalClientId && paypalClientId !== 'placeholder_paypal_client'

  const paypalOptions = {
    clientId: paypalClientId || 'demo',
    currency: 'USD',
    intent: 'capture',
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              {hasValidPayPal ? (
                <PayPalScriptProvider options={paypalOptions}>
                  {children}
                </PayPalScriptProvider>
              ) : (
                children
              )}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}