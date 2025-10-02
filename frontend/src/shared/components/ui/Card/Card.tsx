import React from "react";
import { CardProps } from "./Card.types";

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);
