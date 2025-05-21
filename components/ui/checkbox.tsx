"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn("flex items-center space-x-2 cursor-pointer text-sm", className)}>
        <input
          ref={ref}
          type="checkbox"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
