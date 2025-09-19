import React from 'react';
import type { LoadingSpinnerProps } from './LoadingSpinner.types';

const getSizeStyles = (size: LoadingSpinnerProps['size'] = 'medium') => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12',
  };
  return sizes[size];
};

const getColorStyles = (color: LoadingSpinnerProps['color'] = 'primary') => {
  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };
  return colors[color];
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  text,
}) => {
  const sizeStyles = getSizeStyles(size);
  const colorStyles = getColorStyles(color);
  const spinnerClass = `animate-spin rounded-full border-2 border-t-transparent ${sizeStyles} ${colorStyles} ${className}`.trim();

  if (text) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className={spinnerClass} />
        <span className="text-sm text-gray-600">{text}</span>
      </div>
    );
  }

  return <div className={spinnerClass} />;
};