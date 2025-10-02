import React from "react";
import { Badge } from "../Badge";
import { CardHeaderProps } from "./Card.types";

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  className = "",
  badge,
}) => (
  <div
    className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
  </div>
);
