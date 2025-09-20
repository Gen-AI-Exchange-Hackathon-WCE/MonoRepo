import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Artisan Marketplace - Bring Your Craft Online",
  description:
    "AI-powered marketplace where artisans can showcase their crafts and customers discover authentic handmade products",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'