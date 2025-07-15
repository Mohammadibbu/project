import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ 
    className, 
    hover = true, 
    clickable = false, 
    loading = false,
    selected = false,
    disabled = false,
    children, 
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseDown = () => {
      if (clickable && !disabled) {
        setIsPressed(true);
      }
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsPressed(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "modern-card transition-all duration-200",
          {
            "hover:shadow-lg hover:scale-[1.02]": hover && !disabled,
            "cursor-pointer": clickable && !disabled,
            "cursor-not-allowed opacity-50": disabled,
            "scale-[0.98]": isPressed,
            "ring-2 ring-primary ring-offset-2": selected,
            "animate-pulse": loading,
          },
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        role={clickable ? "button" : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-pressed={clickable ? selected : undefined}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="loading-spinner w-8 h-8" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";

export { InteractiveCard };