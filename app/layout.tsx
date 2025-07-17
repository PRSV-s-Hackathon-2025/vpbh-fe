import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClickHouse BigData Console - Process Millions of Records Under 1 Second',
  description: 'Building BigData solution using ClickHouse to process millions of records under 1 second. Real-time analytics, SQL query console, and performance monitoring.',
  keywords: 'ClickHouse, BigData, Analytics, SQL, Real-time, Performance, Database, AWS, S3',
  authors: [{ name: 'VPBH Team' }],
  openGraph: {
    title: 'ClickHouse BigData Console - Ultra-Fast Data Processing',
    description: 'Building BigData solution using ClickHouse to process millions of records under 1 second',
    images: ['/background.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClickHouse BigData Console - Ultra-Fast Data Processing',
    description: 'Building BigData solution using ClickHouse to process millions of records under 1 second',
    images: ['/background.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
