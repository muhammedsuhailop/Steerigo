import React, { forwardRef } from 'react';
import type { SelectProps } from './Select.types';

const getSizeStyles = (size: SelectProps['size'] = 'md') => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  return sizes[size];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  size = 'md',
  isRequired = false,
  isInvalid = false,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error || isInvalid;
  
  const baseStyles = 'border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors bg-white';
  const sizeStyles = getSizeStyles(size);
  const errorStyles = hasError 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const selectClass = `${baseStyles} ${sizeStyles} ${errorStyles} ${widthStyles} ${className}`.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        className={selectClass}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
        }
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
      
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';