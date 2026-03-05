import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-[#e5e5e5] bg-white px-3 text-sm outline-none focus:border-[#e85d2f] focus:ring-2 focus:ring-[#f7c5b3]",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
