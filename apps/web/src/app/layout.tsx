import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Server Monitor',
  description: 'Professional server monitoring dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
