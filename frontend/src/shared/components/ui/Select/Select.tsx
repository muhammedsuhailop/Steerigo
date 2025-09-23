import React, { useState, useRef, useEffect, forwardRef } from "react";
import type { SelectProps } from "./Select.types";

const getSizeStyles = (size: SelectProps["size"] = "md") => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };
  return sizes[size];
};

const getVariantStyles = (
  isInvalid?: boolean,
  disabled?: boolean,
  isOpen?: boolean
) => {
  const baseStyles =
    "border-2 transition-all duration-200 ease-in-out rounded-md shadow-sm cursor-pointer";

  if (disabled) {
    return `${baseStyles} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`;
  }

  if (isInvalid) {
    return `${baseStyles} bg-gray-50 border-red-300 text-gray-700 ${
      isOpen ? "border-red-400 ring-4 ring-red-100" : "hover:border-red-400"
    }`;
  }

  return `${baseStyles} bg-gray-50 border-gray-300 text-gray-700 ${
    isOpen
      ? "border-gray-500 ring-4 ring-gray-100"
      : "hover:border-gray-400 hover:bg-gray-100"
  }`;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      size = "md",
      isRequired = false,
      isInvalid = false,
      fullWidth = true,
      className = "",
      disabled,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error || isInvalid;

    const sizeStyles = getSizeStyles(size);
    const variantStyles = getVariantStyles(hasError, disabled, isOpen);
    const widthStyles = fullWidth ? "w-full" : "w-auto";

    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    const displayValue =
      selectedOption?.label || placeholder || "Select an option";

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    const handleOptionClick = (optionValue: string | number) => {
      if (disabled) return;

      setSelectedValue(optionValue);
      setIsOpen(false);

      if (onChange && hiddenSelectRef.current) {
        hiddenSelectRef.current.value = String(optionValue);
        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: false,
          value: hiddenSelectRef.current,
        });
        onChange(event as any);
      }
    };

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div className={`${fullWidth ? "w-full" : "w-auto"} space-y-1.5`}>
        {/* Hidden native select for form compatibility */}
        <select
          ref={hiddenSelectRef}
          value={selectedValue}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            {label}
            {isRequired && <span className="text-red-400 ml-1.5">*</span>}
          </label>
        )}

        <div ref={dropdownRef} className="relative">
          {/* Custom Select Button */}
          <button
            type="button"
            id={selectId}
            className={`${sizeStyles} ${variantStyles} ${widthStyles} ${className} flex items-center justify-between`.trim()}
            onClick={toggleDropdown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
          >
            <span
              className={`block truncate ${
                !selectedOption && placeholder
                  ? "text-gray-400"
                  : "text-gray-700"
              }`}
            >
              {displayValue}
            </span>

            <svg
              className={`h-5 w-5 ml-2 transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180" : "rotate-0"
              } ${
                disabled
                  ? "text-gray-300"
                  : hasError
                  ? "text-red-400"
                  : "text-gray-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 9l4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="py-2">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                    w-full px-4 py-2.5 text-left text-sm transition-colors duration-150
                    ${
                      option.disabled
                        ? "text-gray-400 cursor-not-allowed bg-gray-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                    }
                    ${
                      selectedValue === option.value
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : ""
                    }
                    ${index === 0 ? "rounded-t-md" : ""}
                    ${index === options.length - 1 ? "rounded-b-md" : ""}
                  `}
                    onClick={() => handleOptionClick(option.value)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selectedValue === option.value}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate">{option.label}</span>
                      {selectedValue === option.value && (
                        <svg
                          className="h-4 w-4 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start space-x-1.5 mt-2">
            <svg
              className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p
              id={`${selectId}-error`}
              className="text-sm font-medium text-red-600"
            >
              {error}
            </p>
          </div>
        )}

        {!error && helperText && (
          <div className="flex items-start space-x-1.5 mt-2">
            <svg
              className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p id={`${selectId}-helper`} className="text-sm text-gray-600">
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
