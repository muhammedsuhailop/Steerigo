import React from "react";
import type { BadgeProps } from "./Badge.types";

const getVariantStyles = (variant: BadgeProps["variant"] = "secondary") => {
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    outline: "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50",
  };
  return variants[variant];
};

const getSizeStyles = (size: BadgeProps["size"] = "md") => {
  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };
  return sizes[size];
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "secondary",
  size = "md",
  className = "",
}) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const badgeClasses = [
    "inline-flex items-center font-medium rounded-full border",
    variantStyles,
    sizeStyles,
    className,
  ].join(" ");

  return <span className={badgeClasses}>{children}</span>;
};
