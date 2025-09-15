import React from "react";
import type { LogoProps } from "./Logo.types";
import LogoImage from "@/../public/SteeriGoHorizontal.png";

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "h-6 w-auto",
        md: "h-8 w-auto",
        lg: "h-12 w-auto",
    };

    return (
        <div className={`flex items-center ${className}`}>
            <img
                src={LogoImage}
                alt="SteerGo Logo"
                className={`${sizeClasses[size]} object-contain`}
            />
        </div>
    );
};
