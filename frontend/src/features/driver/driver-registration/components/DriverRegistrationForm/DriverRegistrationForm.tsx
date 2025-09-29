import React from "react";
import { useDriverRegistration } from "../../hooks/useDriverRegistration";
import { RegistrationStep } from "../../types/driverRegistration.types";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { LicenseInfoStep } from "./steps/LicenseInfoStep";
import { IdInfoStep } from "./steps/IdInfoStep";
import { DocumentsStep } from "./steps/DocumentsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { StepIndicator } from "./StepIndicator";
import { NavigationButtons } from "./NavigationButtons";
import { LoadingSpinner, ErrorBoundary } from "@/shared/components/ui";

export const DriverRegistrationForm: React.FC = () => {
  const {
    currentStep,
    isLoading,
    isSubmitting,
    registrationSuccess,
    registrationError,
    goToNextStep,
    goToPreviousStep,
    getFormCompletionPercentage,
    resetRegistrationForm,
  } = useDriverRegistration();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case RegistrationStep.PERSONAL_INFO:
        return <PersonalInfoStep />;
      case RegistrationStep.LICENSE_INFO:
        return <LicenseInfoStep />;
      case RegistrationStep.ID_INFO:
        return <IdInfoStep />;
      case RegistrationStep.DOCUMENTS:
        return <DocumentsStep />;
      case RegistrationStep.REVIEW:
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  const getStepTitle = (currentStep: RegistrationStep = 0) => {
    const titles: Record<RegistrationStep, string> = {
      [RegistrationStep.PERSONAL_INFO]: "Personal Information",
      [RegistrationStep.LICENSE_INFO]: "License Information",
      [RegistrationStep.ID_INFO]: "ID Information",
      [RegistrationStep.DOCUMENTS]: "Document Upload",
      [RegistrationStep.REVIEW]: "Review & Submit",
    };

    return titles[currentStep] || "Registration";
  };

  if (registrationSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your driver registration has been submitted successfully.
          </p>
          <button
            onClick={resetRegistrationForm}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors"
          >
            Register Another Driver
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driver Registration
          </h1>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Complete all steps to register as a driver
            </p>
            <div className="text-sm text-gray-500">
              {getFormCompletionPercentage()}% Complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gray-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getFormCompletionPercentage()}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Error Message */}
        {registrationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Registration Error
                </h3>
                <p className="text-sm text-red-700 mt-1">{registrationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Step {currentStep + 1}: {getStepTitle(currentStep)}
            </h2>

            {/* Loading Overlay */}
            {(isLoading || isSubmitting) && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner size="large" />
              </div>
            )}

            {/* Current Step Content */}
            <div className="relative">{renderCurrentStep()}</div>
          </div>
        </div>

        {/* Navigation */}
        <NavigationButtons
          currentStep={currentStep}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />
      </div>
    </ErrorBoundary>
  );
};
