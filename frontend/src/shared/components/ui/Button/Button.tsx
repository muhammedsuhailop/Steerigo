import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import type { ButtonProps } from "./Button.types";

const getVariantStyles = (
  variant: ButtonProps["variant"] = "primary",
  isLoading?: boolean,
  disabled?: boolean
) => {
  const baseStyles = "border-2 transition-all duration-200 ease-in-out shadow-sm";

  if (disabled || isLoading) {
    return `${baseStyles} bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed`;
  }

  const variants = {
    primary:
      `${baseStyles} bg-gray-700 hover:bg-gray-800 text-white border-gray-700 hover:border-gray-800 focus:ring-4 focus:ring-gray-200`,
    secondary:
      `${baseStyles} bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-gray-100`,
    outline:
      `${baseStyles} bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-gray-100`,
    ghost:
      `${baseStyles} bg-transparent hover:bg-gray-100 text-gray-700 border-transparent hover:border-gray-300 focus:ring-4 focus:ring-gray-100`,
    danger:
      `${baseStyles} bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-4 focus:ring-red-100`,
    success:
      `${baseStyles} bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 focus:ring-4 focus:ring-emerald-100`,
    white:
      `${baseStyles} bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-gray-100`,
  };

  return variants[variant];
};

const getSizeStyles = (size: ButtonProps["size"] = "md") => {
  const sizes = {
    xs: "px-2.5 py-1.5 text-xs font-medium",
    sm: "px-3 py-2 text-sm font-medium",
    md: "px-4 py-2.5 text-sm font-semibold",
    lg: "px-5 py-3 text-base font-semibold",
    xl: "px-6 py-3.5 text-base font-semibold",
    icon: "p-2.5",
  };
  return sizes[size];
};

const getRoundedStyles = (rounded: ButtonProps["rounded"] = "md") => {
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl", // Added xl option to match Select
    full: "rounded-full",
  };
  return roundedStyles[rounded];
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = "md",
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-offset-0";

  const variantStyles = getVariantStyles(variant, isLoading, disabled);
  const sizeStyles = getSizeStyles(size);
  const roundedStyles = getRoundedStyles(rounded);
  const widthStyles = fullWidth ? "w-full" : "";

  const buttonClass =
    `${baseStyles} ${variantStyles} ${sizeStyles} ${roundedStyles} ${widthStyles} ${className}`.trim();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <LoadingSpinner 
            size="small" 
            color={variant === "primary" || variant === "danger" || variant === "success" ? "white" : "gray"} 
            className="mr-2" 
          />
          <span>{children || "Loading..."}</span>
        </div>
      );
    }

    // Icon-only button when size is icon and no children
    if (size === "icon" && !children) {
      return <>{leftIcon || rightIcon}</>;
    }

    return (
      <div className="flex items-center justify-center">
        {leftIcon && (
          <span className={children ? "mr-2" : ""}>{leftIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {rightIcon && (
          <span className={children ? "ml-2" : ""}>{rightIcon}</span>
        )}
      </div>
    );
  };

  return (
    <button 
      className={buttonClass} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {renderContent()}
    </button>
  );
};