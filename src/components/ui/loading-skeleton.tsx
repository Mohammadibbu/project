import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  avatar?: boolean;
  button?: boolean;
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, lines = 3, avatar = false, button = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {avatar && (
          <div className="flex items-center space-x-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-1/4 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        )}
        
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div 
              className={cn(
                "skeleton h-4 rounded",
                i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full"
              )} 
            />
          </div>
        ))}
        
        {button && (
          <div className="skeleton h-10 w-24 rounded-lg" />
        )}
      </div>
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export { LoadingSkeleton };