import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button ref={ref} className={cn("px-4 py-2 rounded bg-primary text-white", className)} {...props} />
    )
  }
)
Button.displayName = "Button"