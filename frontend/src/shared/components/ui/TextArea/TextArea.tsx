import React, { forwardRef } from 'react';
import type { TextAreaProps } from './TextArea.types';

const getResizeStyles = (resize: TextAreaProps['resize'] = 'vertical') => {
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };
  return resizeStyles[resize];
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  isRequired = false,
  isInvalid = false,
  resize = 'vertical',
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const textAreaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error || isInvalid;
  
  const baseStyles = 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors';
  const errorStyles = hasError 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const resizeStyles = getResizeStyles(resize);
  
  const textAreaClass = `${baseStyles} ${errorStyles} ${resizeStyles} ${className}`.trim();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textAreaId} className="block text-sm font-medium text-gray-700 mb-1">
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
          error ? `${textAreaId}-error` : helperText ? `${textAreaId}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <p id={`${textAreaId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${textAreaId}-helper`} className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';