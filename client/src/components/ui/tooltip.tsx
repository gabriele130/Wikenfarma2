import * as React from "react"

const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
))
TooltipProvider.displayName = "TooltipProvider"

export { TooltipProvider }