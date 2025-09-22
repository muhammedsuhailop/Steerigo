import React, { useState, forwardRef, useCallback } from "react";
import { Input } from "../Input";
import type { DateInputProps } from "./DateInput.types";

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      emptyPlaceholder = "Select date",
      datePrefix,
      size = "md",
      disabled = false,
      error,
      helperText,
      label,
      isRequired = false,
      isInvalid = false,
      fullWidth = true,
      className = "",
      id,
      onFocus,
      onBlur,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isNativeFocused, setIsNativeFocused] = useState(false);

    // Format date for display with DD-MM-YY format
    const formatDate = useCallback(
      (dateValue: string) => {
        if (!dateValue) return "";

        try {
          const date = new Date(dateValue + "T00:00:00");
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear()).slice(-2);
          const formatted = `${day}-${month}-${year}`;

          return datePrefix ? `${datePrefix} ${formatted}` : formatted;
        } catch {
          return dateValue;
        }
      },
      [datePrefix]
    );

    const displayValue = formatDate(value);
    const shouldShowCustomPlaceholder = !value && !isNativeFocused;
    const shouldShowFormattedDate = value && !isNativeFocused;
    const hasError = !!error || isInvalid;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsNativeFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        // delay to handle calendar picker interactions
        setTimeout(() => {
          setIsNativeFocused(false);
        }, 100);
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLInputElement>) => {
        if (!disabled) {
          setIsNativeFocused(true);
          if (inputRef.current) {
            inputRef.current.showPicker?.();
          }
        }
        onClick?.(e);
      },
      [disabled, onClick]
    );

    const handleOverlayClick = useCallback(() => {
      if (!disabled && inputRef.current) {
        setIsNativeFocused(true);
        inputRef.current.focus();
        inputRef.current.showPicker?.();
      }
    }, [disabled]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className="relative">
        {/* Native date input */}
        <Input
          ref={inputRef}
          type="date"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          disabled={disabled}
          size={size}
          error={error}
          helperText={helperText}
          label={label}
          isRequired={isRequired}
          isInvalid={hasError}
          fullWidth={fullWidth}
          id={id}
          className={`
          ${
            shouldShowFormattedDate
              ? "text-transparent [&::-webkit-calendar-picker-indicator]:opacity-0"
              : ""
          }
          ${
            shouldShowCustomPlaceholder
              ? "[&::-webkit-datetime-edit]:opacity-0"
              : ""
          }
          cursor-pointer ${className}
        `}
          style={{
            colorScheme: "light",
          }}
          {...props}
        />

        {/* Custom placeholder overlay  */}
        {shouldShowCustomPlaceholder && (
          <div
            className="absolute inset-0 flex items-center px-4 py-2.5 cursor-pointer z-10"
            onClick={handleOverlayClick}
          >
            <span className="text-gray-400 text-sm select-none">
              {emptyPlaceholder}
            </span>
          </div>
        )}

        {/* Formatted date display overlay */}
        {shouldShowFormattedDate && (
          <div
            className="absolute inset-0 flex items-center px-4 py-2.5 cursor-pointer z-10"
            onClick={handleOverlayClick}
          >
            <span
              className={`text-sm select-none w-full ${
                disabled ? "text-gray-400" : "text-gray-700"
              } ${datePrefix ? "font-medium" : "font-normal"}`}
            >
              {displayValue}
            </span>
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
