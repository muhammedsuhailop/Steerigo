import React from "react";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { Button } from "@/shared/components/ui";

interface NavigationButtonsProps {
  currentStep: RegistrationStep;
  onNext: () => boolean;
  onPrevious: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: () => Promise<any>;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  onNext,
  onPrevious,
  isLoading = false,
  isSubmitting = false,
  onSubmit,
}) => {
  console.log("Current step index:", currentStep);
  const isFirstStep = currentStep === RegistrationStep.PERSONAL_INFO;
  const isLastStep = currentStep === RegistrationStep.REVIEW;
  console.log("isLastStep step index:", isLastStep);

  const handleNextClick = async () => {
    if (isLastStep) {
      await onSubmit();
    } else {
      const isValid = onNext();
      if (!isValid) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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
        disabled={isLoading || isSubmitting}
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
