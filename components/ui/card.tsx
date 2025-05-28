export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded border p-4 shadow">{children}</div>
}
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>
}
export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold text-lg">{children}</div>
}
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}