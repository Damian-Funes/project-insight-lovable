
import React, { memo, forwardRef, useRef, useImperativeHandle } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OptimizedInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void;
  controlled?: boolean;
  debounceMs?: number;
}

export const OptimizedInput = memo(forwardRef<HTMLInputElement, OptimizedInputProps>(
  ({ onChange, controlled = true, debounceMs = 0, className, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useImperativeHandle(ref, () => internalRef.current!);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (onChange) {
        if (debounceMs > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            onChange(value);
          }, debounceMs);
        } else {
          onChange(value);
        }
      }
    };

    if (!controlled) {
      return (
        <Input
          ref={internalRef}
          onChange={handleChange}
          className={cn(className)}
          {...props}
        />
      );
    }

    return (
      <Input
        ref={internalRef}
        onChange={handleChange}
        className={cn(className)}
        {...props}
      />
    );
  }
));

OptimizedInput.displayName = "OptimizedInput";
