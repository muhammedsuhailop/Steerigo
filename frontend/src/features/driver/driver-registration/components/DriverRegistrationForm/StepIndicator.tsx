import React from "react";
import {
  FaUser,
  FaFileAlt,
  FaIdBadge,
  FaPaperclip,
  FaCheck,
} from "react-icons/fa";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { useDriverRegistration } from "../../hooks/useDriverRegistration";

interface StepIndicatorProps {
  currentStep: RegistrationStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
}) => {
  const { getStepCompletionStatus } = useDriverRegistration();

  const steps = [
    {
      key: RegistrationStep.PERSONAL_INFO,
      title: "Personal",
      icon: <FaUser />,
    },
    {
      key: RegistrationStep.LICENSE_INFO,
      title: "License",
      icon: <FaFileAlt />,
    },
    { key: RegistrationStep.ID_INFO, title: "ID Info", icon: <FaIdBadge /> },
    {
      key: RegistrationStep.DOCUMENTS,
      title: "Documents",
      icon: <FaPaperclip />,
    },
    { key: RegistrationStep.REVIEW, title: "Review", icon: <FaCheck /> },
  ];

  const completionStatus = getStepCompletionStatus();

  const getStepStatus = (stepKey: RegistrationStep) => {
    if (stepKey < currentStep) return "completed";
    if (stepKey === currentStep) return "current";
    return "pending";
  };

  const getStepClasses = (stepKey: RegistrationStep) => {
    const status = getStepStatus(stepKey);
    const isCompleted = completionStatus[stepKey];
    const base =
      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200";
    if (status === "completed" || isCompleted)
      return `${base} bg-emerald-600 text-white`;
    if (status === "current")
      return `${base} bg-gray-700 text-white ring-4 ring-gray-200`;
    return `${base} bg-gray-200 text-gray-500`;
  };

  const getConnectorClasses = (stepKey: RegistrationStep) => {
    const status = getStepStatus(stepKey);
    const isCompleted = completionStatus[stepKey];
    return status === "completed" || isCompleted
      ? "bg-emerald-600"
      : "bg-gray-200";
  };

  return (
    <div className="mb-8">
      <nav aria-label="Registration progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li key={step.key} className="relative flex-1">
              <div className="flex items-center">
                <div className={getStepClasses(step.key)}>
                  {completionStatus[step.key] ? (
                    <FaCheck className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-1 rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getConnectorClasses(
                        step.key
                      )}`}
                      style={{
                        width:
                          step.key < currentStep || completionStatus[step.key]
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <span
                  className={`text-xs font-medium ${
                    step.key === currentStep
                      ? "text-gray-700"
                      : completionStatus[step.key]
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
