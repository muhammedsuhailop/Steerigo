import React from "react";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { Button } from "@/shared/components/ui";

interface NavigationButtonsProps {
  currentStep: RegistrationStep;
  onNext: () => boolean;
  onPrevious: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  canProceedToNext: boolean;
  onSubmit: () => Promise<any>;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  onNext,
  onPrevious,
  isLoading = false,
  isSubmitting = false,
  canProceedToNext,
  onSubmit,
}) => {
  const isFirstStep = currentStep === RegistrationStep.PERSONAL_INFO;
  const isLastStep = currentStep === RegistrationStep.REVIEW;

  const handleNextClick = async () => {
    if (!canProceedToNext) return;
    if (isLastStep) {
      await onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
      {!isFirstStep && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading || isSubmitting}
        >
          Previous
        </Button>
      )}
      <div className="text-sm text-gray-500">
        Step {currentStep + 1} of {Object.keys(RegistrationStep).length / 2}
      </div>
      <Button
        onClick={handleNextClick}
        disabled={isLoading || isSubmitting || !canProceedToNext}
        isLoading={isSubmitting}
      >
        {isLastStep
          ? isSubmitting
            ? "Submitting..."
            : "Submit Registration"
          : "Next"}
      </Button>
    </div>
  );
};
