import React, { forwardRef } from "react";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import type { TextAreaProps } from "./TextArea.types";

const getResizeStyles = (resize: TextAreaProps["resize"] = "vertical") => {
  const resizeStyles = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };
  return resizeStyles[resize];
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired = false,
      isInvalid = false,
      resize = "vertical",
      className = "",
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textAreaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error || isInvalid;

    const baseStyles =
      "w-full px-3 py-2 border-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors";
    const errorStyles = hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-gray-400";
    const resizeStyles = getResizeStyles(resize);

    const textAreaClass =
      `${baseStyles} ${errorStyles} ${resizeStyles} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textAreaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textAreaId}
          rows={rows}
          className={textAreaClass}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${textAreaId}-error`
              : helperText
              ? `${textAreaId}-helper`
              : undefined
          }
          {...props}
        />

        {error && (
          <div className="flex items-start space-x-1.5 mt-2">
            <MdErrorOutline className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p id={`${textAreaId}-error`} className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!error && helperText && (
          <div className="flex items-start space-x-1.5 mt-2">
            <MdInfoOutline className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p id={`${textAreaId}-helper`} className="text-sm text-gray-600">
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
