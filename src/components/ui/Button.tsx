import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-brand-navy text-brand-surface hover:bg-slate-800 shadow-premium",
        secondary: "bg-white text-brand-navy border border-slate-200 hover:bg-slate-50 shadow-premium",
        ghost: "hover:bg-slate-100 text-brand-slate hover:text-brand-navy",
        destructive: "bg-status-error text-white hover:bg-red-600 shadow-premium",
        success: "bg-status-success text-white hover:bg-emerald-600 shadow-premium",
        outline: "border border-brand-navy text-brand-navy hover:bg-slate-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

// Helper to avoid import error if Slot isn't globally available
// Slot is already imported from @radix-ui/react-slot
