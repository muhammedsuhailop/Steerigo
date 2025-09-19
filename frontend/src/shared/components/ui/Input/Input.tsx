import React, { forwardRef } from 'react';
import type { InputProps } from './Input.types';

const getSizeStyles = (size: InputProps['size'] = 'md') => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  return sizes[size];
};

const getVariantStyles = (variant: InputProps['variant'] = 'default', isInvalid?: boolean) => {
  const baseStyles = 'border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  if (isInvalid) {
    return `${baseStyles} border-red-300 focus:border-red-500 focus:ring-red-500`;
  }

  const variants = {
    default: `${baseStyles} border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white`,
    filled: `${baseStyles} border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500`,
    flushed: `${baseStyles} border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent rounded-none`,
  };
  
  return variants[variant];
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  isRequired = false,
  isInvalid = false,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
const hasError = !!error || isInvalid;
  
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant, hasError);
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const inputClass = `${sizeStyles} ${variantStyles} ${widthStyles} ${
    leftIcon ? 'pl-10' : ''
  } ${rightIcon ? 'pr-10' : ''} ${className}`.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClass}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className={`${hasError ? 'text-red-400' : 'text-gray-400'}`}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';