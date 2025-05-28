export const metadata = {
  title: "MarketLens Dashboard",
  description: "A dashboard for product analytics across Blinkit and more",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}