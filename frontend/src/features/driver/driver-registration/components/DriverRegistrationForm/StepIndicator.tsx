import React from "react";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { useDriverRegistration } from "../../hooks/useDriverRegistration";

interface StepIndicatorProps {
  currentStep: RegistrationStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { getStepCompletionStatus } = useDriverRegistration();
  
  const steps = [
    { key: RegistrationStep.PERSONAL_INFO , title: "Personal", icon: "👤" },
    { key: RegistrationStep.VEHICLE_INFO, title: "Vehicle", icon: "🚗" },
    { key: RegistrationStep.LICENSE_INFO, title: "License", icon: "📄" },
    { key: RegistrationStep.ID_INFO, title: "ID Info", icon: "🆔" },
    { key: RegistrationStep.DOCUMENTS, title: "Documents", icon: "📎" },
    { key: RegistrationStep.REVIEW, title: "Review", icon: "✅" }
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
    
    const baseClasses = "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200";
    
    if (status === "completed" || isCompleted) {
      return `${baseClasses} bg-emerald-600 text-white`;
    }
    
    if (status === "current") {
      return `${baseClasses} bg-gray-700 text-white ring-4 ring-gray-200`;
    }
    
    return `${baseClasses} bg-gray-200 text-gray-500`;
  };

  const getConnectorClasses = (stepKey: RegistrationStep) => {
    const status = getStepStatus(stepKey);
    const isCompleted = completionStatus[stepKey];
    
    if (status === "completed" || isCompleted) {
      return "bg-emerald-600";
    }
    
    return "bg-gray-200";
  };

  return (
    <div className="mb-8">
      <nav aria-label="Registration progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li key={step.key} className="relative flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div className={getStepClasses(step.key)}>
                  {completionStatus[step.key] ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-1 rounded-full bg-gray-200">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${getConnectorClasses(step.key)}`}
                      style={{ 
                        width: step.key < currentStep || completionStatus[step.key] ? "100%" : "0%" 
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Step Title */}
              <div className="mt-2 text-center">
                <span className={`text-xs font-medium ${
                  step.key === currentStep 
                    ? "text-gray-700" 
                    : completionStatus[step.key] 
                      ? "text-emerald-600" 
                      : "text-gray-500"
                }`}>
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