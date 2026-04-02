// Standalone format utilities
import React from "react";
import type {
  DateFormatOptions,
  FormatUtils,
} from "@/shared/components/ui/AdminTable/AdminTable.types";

export const Formatters: FormatUtils = {
  // Format currency (default: INR) 
  formatCurrency: (amount: number, currency: string = "INR"): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format date with optional time 
  formatDate: (
    date: string | Date | null,
    options: DateFormatOptions = {}
  ): string => {
    if (!date) return "N/A";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Invalid Date";

      const {
        locale = "en-IN",
        day = "2-digit",
        month = "2-digit",
        year = "numeric",
        includeTime = false,
      } = options;

      const dateFormatOptions: Intl.DateTimeFormatOptions = {
        day,
        month,
        year,
      };

      if (includeTime) {
        dateFormatOptions.hour = "2-digit";
        dateFormatOptions.minute = "2-digit";
      }

      return dateObj.toLocaleDateString(locale, dateFormatOptions);
    } catch {
      return "Invalid Date";
    }
  },

  // Format Indian phone numbers 
  formatPhoneNumber: (phone: string): string => {
    if (!phone) return "—";

    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length === 10) {
      return `+91-${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5)}`;
    }

    if (digitsOnly.length === 12) {
      return `+${digitsOnly.slice(0, 2)}-${digitsOnly.slice(
        2,
        7
      )}-${digitsOnly.slice(7)}`;
    }

    return phone;
  },

  // Format date with expiry indicators 
  formatDateWithExpiry: (
    date: string | null,
    isExpiryDate: boolean = false
  ): React.ReactNode => {
    if (!date) {
      return (
        <span className="text-gray-500">
          {isExpiryDate ? "No Expiry" : "N/A"}
        </span>
      );
    }

    const dateObj = new Date(date);
    const now = Date.now();
    const soon = now + 30 * 24 * 60 * 60 * 1000;

    const isExpired = isExpiryDate && dateObj.getTime() < now;
    const isExpiringSoon =
      isExpiryDate && dateObj.getTime() > now && dateObj.getTime() < soon;

    return (
      <span className="flex items-center gap-2">
        <span>{Formatters.formatDate(date)}</span>
        {isExpired && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
            Expired
          </span>
        )}
        {isExpiringSoon && (
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
            Soon
          </span>
        )}
      </span>
    );
  },
};

export const AdminTableFormatters = Formatters;
