"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart"
import { AuthProvider } from "@/lib/auth/AuthContext"
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute"
import { Toaster } from "sonner"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <CartProvider>
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            expand={false}
            visibleToasts={4}
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
              className: 'my-toast',
              duration: 4000,
            }}
          />
        </Suspense>
      </body>
    </html>
  )
}
