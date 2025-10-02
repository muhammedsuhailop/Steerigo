import React from "react";
import { CardBodyProps } from "./Card.types";

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);
