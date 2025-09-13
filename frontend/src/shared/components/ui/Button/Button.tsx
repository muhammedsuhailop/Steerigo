import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import type { ButtonProps } from './Button.types';

const getVariantStyles = (variant: ButtonProps['variant'] = 'primary') => {
  const variants = {
    primary:
      'bg-[#232323] hover:bg-[#2e2e2e] text-white border-transparent focus:ring-[#3a3a3a] shadow-sm',
    secondary:
      'bg-gray-700 hover:bg-gray-600 text-white border-transparent focus:ring-gray-500 shadow-sm',
    outline:
      'bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-400 focus:ring-gray-500',
    ghost:
      'bg-transparent hover:bg-gray-200 text-gray-900 border-transparent focus:ring-gray-400',
    danger:
      'bg-red-700 hover:bg-red-600 text-white border-transparent focus:ring-red-500 shadow-sm',
    success:
      'bg-emerald-700 hover:bg-emerald-600 text-white border-transparent focus:ring-emerald-500 shadow-sm',
    white:
      'bg-gray-100 hover:bg-white text-gray-900 border border-gray-300 focus:ring-gray-400 shadow-sm',
  };

  return variants[variant];
};



const getSizeStyles = (size: ButtonProps['size'] = 'md') => {
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };
  return sizes[size];
};

const getRoundedStyles = (rounded: ButtonProps['rounded'] = 'md') => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  return roundedStyles[rounded];
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'md',
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border';
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const roundedStyles = getRoundedStyles(rounded);
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClass = `${baseStyles} ${variantStyles} ${sizeStyles} ${roundedStyles} ${widthStyles} ${disabledStyles} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="small" className="mr-2" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};