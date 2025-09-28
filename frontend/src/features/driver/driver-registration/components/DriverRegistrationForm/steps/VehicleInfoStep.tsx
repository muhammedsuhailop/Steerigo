import React from "react";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";

export const VehicleInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();

  const vehicleTypeOptions = [
    { value: "Hatchback", label: "Hatchback" },
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
  ];

  const gearTypeOptions = [
    { value: "Manual", label: "Manual" },
    { value: "Automatic", label: "Automatic" },
  ];

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    updateData({ [field]: updatedValues });
  };

  const isSelected = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];
    return currentValues.includes(value);
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Vehicle Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select all vehicle types you can drive
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {vehicleTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("vehicleTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("vehicleTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("vehicleTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("vehicleTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("vehicleTypes", option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.vehicleTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.vehicleTypes}
          </p>
        )}
      </div>

      {/* Gear Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Gear Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select all gear types you can operate
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gearTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("gearTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("gearTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("gearTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("gearTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("gearTypes", option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {errors.gearTypes && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.gearTypes}
          </p>
        )}
      </div>
    </div>
  );
};
