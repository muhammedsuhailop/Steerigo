import React from "react";
import type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from "./Card.types";

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ title, badge, className = "", children }) => (
  <div
    className={`flex items-center justify-between p-4 border-b border-gray-100 ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {badge && (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${
          badge.variant === "success"
            ? "bg-green-100 text-green-800"
            : badge.variant === "warning"
            ? "bg-yellow-100 text-yellow-800"
            : badge.variant === "danger"
            ? "bg-red-100 text-red-800"
            : badge.variant === "info"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {badge.text}
      </span>
    )}
    {children}
  </div>
);

Card.Body = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = "", ...props }) => (
  <div
    className={`p-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-600 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
