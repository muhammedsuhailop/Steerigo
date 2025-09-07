import React, { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";
import type { FormFieldProps, SelectOption } from "@/types";

interface SelectProps
  extends Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      "disabled" | "required"
    >,
    Omit<FormFieldProps, "disabled" | "required"> {
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      className = "",
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const selectClasses = clsx(
      "block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
      {
        "ring-gray-300 focus:ring-primary-600": !error,
        "ring-error-300 focus:ring-error-500": error,
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200":
          disabled,
      },
      className
    );

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {(error || helperText) && (
          <p
            className={clsx(
              "mt-2 text-sm",
              error ? "text-error-600" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
