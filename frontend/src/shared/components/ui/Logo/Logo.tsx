import React from "react";
import type { LogoProps } from "./Logo.types";
import LogoHorizontal from "@/../public/SteeriGoHorizontal.png";
import LogoSquare from "@/../public/steerigoLogo.png";

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
  variant = "horizontal",
}) => {
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto",
  };

  const logos = {
    horizontal: LogoHorizontal,
    square: LogoSquare,
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logos[variant]}
        alt="SteerGo Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};
