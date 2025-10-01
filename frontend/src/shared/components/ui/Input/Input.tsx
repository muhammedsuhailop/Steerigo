import React, { forwardRef } from "react";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import type { InputProps } from "./Input.types";

const getSizeStyles = (size: InputProps["size"] = "md") => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };
  return sizes[size];
};

const getVariantStyles = (
  variant: InputProps["variant"] = "default",
  isInvalid?: boolean,
  disabled?: boolean
) => {
  const baseStyles =
    "border-2 transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-offset-0";

  if (disabled) {
    return `${baseStyles} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed rounded-md`;
  }

  if (isInvalid) {
    return `${baseStyles} bg-gray-50 border-red-300 text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 hover:border-red-400 rounded-md`;
  }

  const variants = {
    default: `${baseStyles} bg-gray-50 border-gray-300 text-gray-700 focus:border-gray-500 focus:ring-4 focus:ring-gray-100 hover:border-gray-400 hover:bg-gray-100 rounded-md`,
    filled: `${baseStyles} bg-gray-100 border-transparent text-gray-700 focus:bg-white focus:border-gray-500 focus:ring-4 focus:ring-gray-100 hover:bg-gray-200 rounded-md`,
    flushed: `${baseStyles} border-0 border-b-2 border-gray-200 bg-transparent text-gray-700 focus:border-gray-500 focus:ring-0 rounded-none hover:border-gray-400`,
  };

  return variants[variant];
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = "md",
      variant = "default",
      isRequired = false,
      isInvalid = false,
      fullWidth = true,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error || isInvalid;

    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(variant, hasError, disabled);
    const widthStyles = fullWidth ? "w-full" : "w-auto";

    const inputClass = `${sizeStyles} ${variantStyles} ${widthStyles} ${
      leftIcon ? "pl-10" : ""
    } ${rightIcon ? "pr-10" : ""} ${className}`.trim();

    return (
      <div className={`${fullWidth ? "w-full" : "w-auto"} space-y-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            {label}
            {isRequired && <span className="text-red-400 ml-1.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span
                className={`transition-colors duration-200 ${
                  hasError ? "text-red-400" : "text-gray-500"
                }`}
              >
                {leftIcon}
              </span>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClass}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span
                className={`transition-colors duration-200 ${
                  hasError ? "text-red-400" : "text-gray-500"
                }`}
              >
                {rightIcon}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start space-x-1.5 mt-2">
            <MdErrorOutline className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p
              id={`${inputId}-error`}
              className="text-sm font-medium text-red-600"
            >
              {error}
            </p>
          </div>
        )}

        {!error && helperText && (
          <div className="flex items-start space-x-1.5 mt-2">
            <MdInfoOutline className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p id={`${inputId}-helper`} className="text-sm text-gray-600">
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
