import * as React from "react"
import { cn } from "@/lib/utils"

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("px-2 py-1 text-sm bg-muted rounded", className)}>{children}</span>
}