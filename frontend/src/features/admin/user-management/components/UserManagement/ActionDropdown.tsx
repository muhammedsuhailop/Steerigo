import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiLoader4Line } from "react-icons/ri";
import { FaCheck, FaCheckCircle, FaWindowClose } from "react-icons/fa";
import { GoStop, GoBlocked } from "react-icons/go";
import { ConfirmationModal } from "@/shared/components/ui";
import type { User, UserAction } from "./UserManagement.types";
import { USER_ACTIONS, getAvailableActions } from "./UserManagement.types";

interface ActionDropdownProps {
  user: User;
  onAction: (userId: string, action: UserAction) => void;
  loading?: boolean;
}

interface PendingAction {
  action: UserAction;
  userId: string;
}

const ActionIcons: Record<
  UserAction,
  React.ComponentType<{ className?: string }>
> = {
  activate: FaCheck,
  verify: FaCheckCircle,
  suspend: GoStop,
  deactivate: FaWindowClose,
  block: GoBlocked,
};

const getConfirmationConfig = (action: UserAction, userName: string) => {
  const configs = {
    activate: {
      title: "Activate User",
      message: `Are you sure you want to activate "${userName}"? This will allow them to access the platform.`,
      variant: "success" as const,
      confirmText: "Activate User",
    },
    verify: {
      title: "Verify User",
      message: `Are you sure you want to verify "${userName}"? This will mark their account as verified and activate it.`,
      variant: "info" as const,
      confirmText: "Verify User",
    },
    suspend: {
      title: "Suspend User",
      message: `Are you sure you want to suspend "${userName}"? They will be temporarily blocked from accessing the platform.`,
      variant: "warning" as const,
      confirmText: "Suspend User",
    },
    deactivate: {
      title: "Deactivate User",
      message: `Are you sure you want to deactivate "${userName}"? They will no longer be able to access their account.`,
      variant: "warning" as const,
      confirmText: "Deactivate User",
    },
    block: {
      title: "Block User",
      message: `Are you sure you want to block "${userName}"? This action will permanently prevent them from accessing the platform and cannot be easily undone.`,
      variant: "danger" as const,
      confirmText: "Block User",
    },
  };
  return configs[action];
};

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  user,
  onAction,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryAction, setPrimaryAction] = useState<UserAction | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableActions = getAvailableActions(user.status);

  useEffect(() => {
    if (availableActions.length > 0) {
      setPrimaryAction(availableActions[0]);
    }
  }, [availableActions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleActionWithConfirmation = (action: UserAction) => {
    const userId = user.userId;
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    setPendingAction({ action, userId });
    setShowConfirmation(true);
    setIsOpen(false);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      onAction(pendingAction.userId, pendingAction.action);
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  if (availableActions.length === 0) {
    return (
      <div className="text-xs text-gray-400 px-2 py-1 rounded bg-gray-50">
        No actions
      </div>
    );
  }

  const handlePrimaryAction = () => {
    if (primaryAction) {
      handleActionWithConfirmation(primaryAction);
    }
  };

  const handleSecondaryAction = (action: UserAction) => {
    handleActionWithConfirmation(action);
  };

  if (!primaryAction) return null;

  const primaryActionConfig = USER_ACTIONS[primaryAction];
  const secondaryActions = availableActions.slice(1);
  const PrimaryIcon = ActionIcons[primaryAction];

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-green-600";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white border-yellow-600";
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-red-600";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white border-gray-600";
    }
  };

  const getDropdownItemStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "text-green-700 hover:bg-green-50 hover:text-green-800";
      case "warning":
        return "text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800";
      case "danger":
        return "text-red-700 hover:bg-red-50 hover:text-red-800";
      case "info":
        return "text-blue-700 hover:bg-blue-50 hover:text-blue-800";
      default:
        return "text-gray-700 hover:bg-gray-50 hover:text-gray-800";
    }
  };

  const confirmationConfig = pendingAction
    ? getConfirmationConfig(pendingAction.action, user.name)
    : null;

  return (
    <>
      <div className="relative inline-block" ref={dropdownRef}>
        <div className="flex">
          {/* Primary Action Button */}
          <button
            onClick={handlePrimaryAction}
            disabled={loading}
            className={`
              inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
              ${getButtonStyles(primaryActionConfig.variant)}
              ${secondaryActions.length > 0 ? "border-r-0" : "rounded-r-md"}
            `}
          >
            {loading ? (
              <RiLoader4Line className="w-4 h-4 animate-spin mr-1.5" />
            ) : (
              <PrimaryIcon className="w-4 h-4 mr-1.5" />
            )}
            <span className="hidden sm:inline">
              {primaryActionConfig.label}
            </span>
            <span className="sm:hidden">
              {primaryActionConfig.label.slice(0, 3)}
            </span>
          </button>

          {/* Dropdown Toggle */}
          {secondaryActions.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={loading}
              className={`
                inline-flex items-center px-2 py-1.5 text-sm font-medium rounded-r-md border border-l-0
                focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${getButtonStyles(primaryActionConfig.variant)}
                ${isOpen ? "ring-2 ring-offset-1" : ""}
              `}
            >
              <RiArrowDownSLine
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && secondaryActions.length > 0 && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              {secondaryActions.map((actionKey) => {
                const actionConfig = USER_ACTIONS[actionKey];
                const ActionIcon = ActionIcons[actionKey];

                return (
                  <button
                    key={actionKey}
                    onClick={() => handleSecondaryAction(actionKey)}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm transition-colors duration-150
                      flex items-center space-x-3 focus:outline-none
                      ${getDropdownItemStyles(actionConfig.variant)}
                    `}
                  >
                    <ActionIcon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {actionConfig.label}
                      </div>
                      <div className="text-xs opacity-75 mt-0.5 truncate">
                        {actionConfig.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {confirmationConfig && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCancelAction}
          onConfirm={handleConfirmAction}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          variant={confirmationConfig.variant}
          confirmText={confirmationConfig.confirmText}
          isLoading={loading}
        />
      )}
    </>
  );
};
