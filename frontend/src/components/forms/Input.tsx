import React, { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import type { FormFieldProps } from "@/types";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "disabled" | "required">,
    Omit<FormFieldProps, "disabled" | "required"> {
  readonly variant?: "default" | "filled";
  disabled?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      variant = "default",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      "w-full px-3 py-2 border rounded-md text-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      {
        // Default variant
        "border-gray-300 bg-white": variant === "default" && !error,

        // Filled variant
        "border-gray-200 bg-gray-50": variant === "filled" && !error,

        // Error state
        "border-red-300 bg-red-50 text-red-900 placeholder-red-300": error,

        // Disabled state
        "opacity-50 cursor-not-allowed": disabled,
      },
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          required={required}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={clsx(
              "mt-1 text-xs",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
