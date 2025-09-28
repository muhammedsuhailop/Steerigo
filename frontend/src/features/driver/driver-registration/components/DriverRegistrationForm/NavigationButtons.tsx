import React from "react";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { Button } from "@/shared/components/ui";
import { useDriverRegistration } from "../../hooks/useDriverRegistration";

interface NavigationButtonsProps {
  currentStep: RegistrationStep;
  onNext: () => boolean;
  onPrevious: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  onNext,
  onPrevious,
  isLoading = false,
  isSubmitting = false,
}) => {
  const { canProceedToNext, handleSubmitRegistration } =
    useDriverRegistration();

  const isFirstStep = currentStep === RegistrationStep.PERSONAL_INFO;
  const isLastStep = currentStep === RegistrationStep.REVIEW;
  const canProceed = canProceedToNext();

  const handleNextClick = async () => {
    if (isLastStep) {
      // Submit the form
      await handleSubmitRegistration();
    } else {
      // Move to next step
      onNext();
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      {/* Previous Button */}
      <div>
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading || isSubmitting}
            leftIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            Previous
          </Button>
        )}
      </div>

      {/* Step Info */}
      <div className="text-sm text-gray-500">
        Step {currentStep + 1} of {Object.keys(RegistrationStep).length / 2}
      </div>

      {/* Next/Submit Button */}
      <div>
        <Button
          onClick={handleNextClick}
          disabled={!canProceed || isLoading || isSubmitting}
          isLoading={isSubmitting}
          rightIcon={
            isLastStep ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )
          }
        >
          {isLastStep
            ? isSubmitting
              ? "Submitting..."
              : "Submit Registration"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};
