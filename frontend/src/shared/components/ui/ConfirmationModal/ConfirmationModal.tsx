import React from "react";
import {
  RiCloseLine,
  RiAlertLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiQuestionLine,
} from "react-icons/ri";
import { Button } from "../Button";
import { LoadingSpinner } from "../LoadingSpinner";
import type { ConfirmationModalProps } from "./ConfirmationModal.types";

const getVariantConfig = (
  variant: ConfirmationModalProps["variant"] = "question"
) => {
  const variants = {
    info: {
      icon: RiInformationLine,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      confirmVariant: "primary" as const,
    },
    warning: {
      icon: RiErrorWarningLine,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      confirmVariant: "secondary" as const,
    },
    danger: {
      icon: RiAlertLine,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      confirmVariant: "danger" as const,
    },
    success: {
      icon: RiCheckLine,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      confirmVariant: "success" as const,
    },
    question: {
      icon: RiQuestionLine,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
      confirmVariant: "primary" as const,
    },
  };
  return variants[variant];
};

const getSizeStyles = (size: ConfirmationModalProps["size"] = "md") => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };
  return sizes[size];
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "question",
  isLoading = false,
  showIcon = true,
  size = "md",
}) => {
  const config = getVariantConfig(variant);
  const sizeClass = getSizeStyles(size);
  const Icon = config.icon;

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose, isLoading]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-[1px] transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className={`relative inline-block w-full ${sizeClass} p-6 overflow-hidden text-left align-middle transition-all duration-300 transform bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-lg`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="flex">
            {showIcon && (
              <div className="flex-shrink-0 mr-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1 mt-1 min-w-0 overflow-visible">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-6 break-words">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              className="sm:order-2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
