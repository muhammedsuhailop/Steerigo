import React from "react";
import { CardFooterProps } from "./Card.types";

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);
