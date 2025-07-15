import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        success: "status-success",
        warning: "status-warning",
        danger: "status-danger",
        info: "status-info",
        default: "bg-muted text-muted-foreground border border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
  pulse?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, variant, size, icon, pulse = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          statusBadgeVariants({ variant, size }),
          {
            "animate-pulse": pulse,
          },
          className
        )}
        {...props}
      >
        {icon && <span className="w-2 h-2">{icon}</span>}
        {children}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };