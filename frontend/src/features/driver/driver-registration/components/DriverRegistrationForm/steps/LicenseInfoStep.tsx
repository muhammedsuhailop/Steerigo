import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";

export const LicenseInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateData({ [field]: event.target.value });
    };

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

  const licenseCategoryOptions = [
    { value: "", label: "Select License Category" },
    { value: "LMV", label: "LMV (Light Motor Vehicle)" },
    { value: "HMV", label: "HMV (Heavy Motor Vehicle)" },
    { value: "MCWG", label: "MCWG (Motorcycle With Gear)" },
    { value: "MCWOG", label: "MCWOG (Motorcycle Without Gear)" },
  ];

  const bodyTypeOptions = [
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Hatchback", label: "Hatchback" },
    { value: "Luxury", label: "Luxury" },
  ];

  const gearTypeOptions = [
    { value: "Manual", label: "Manual" },
    { value: "Automatic", label: "Automatic" },
  ];

  return (
    <div className="space-y-6">
      {/* License Category */}
      <Select
        label="License Category"
        value={formData.licenseCategory || ""}
        onChange={handleInputChange("licenseCategory")}
        options={licenseCategoryOptions}
        error={errors.licenseCategory}
        isInvalid={!!errors.licenseCategory}
        isRequired
      />

      {/* License Number */}
      <Input
        label="License Number"
        value={formData.licenseNumber || ""}
        onChange={handleInputChange("licenseNumber")}
        error={errors.licenseNumber}
        isInvalid={!!errors.licenseNumber}
        placeholder="KL147852025"
        isRequired
      />

      {/* License Body Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          License Body Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select body types covered by your license
        </p>

        <div className="grid grid-cols-2 gap-3">
          {bodyTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("licenseBodyTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("licenseBodyTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("licenseBodyTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("licenseBodyTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("licenseBodyTypes", option.value) && (
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

        {errors.licenseBodyTypes && (
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
            {errors.licenseBodyTypes}
          </p>
        )}
      </div>

      {/* License Gear Types */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          License Gear Types <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Select gear types covered by your license
        </p>

        <div className="grid grid-cols-2 gap-3">
          {gearTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                isSelected("licenseGearTypes", option.value)
                  ? "border-gray-700 bg-gray-50 text-gray-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected("licenseGearTypes", option.value)}
                onChange={() =>
                  handleMultiSelectChange("licenseGearTypes", option.value)
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected("licenseGearTypes", option.value)
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected("licenseGearTypes", option.value) && (
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

        {errors.licenseGearTypes && (
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
            {errors.licenseGearTypes}
          </p>
        )}
      </div>

      {/* License Issue Date */}
      <DateInput
        label="License Issue Date"
        value={formData.licenseIssueDate || ""}
        onChange={handleInputChange("licenseIssueDate")}
        error={errors.licenseIssueDate}
        isInvalid={!!errors.licenseIssueDate}
        // max={new Date().toISOString().split("T")}
        isRequired
      />

      {/* License Expiry Date */}
      <DateInput
        label="License Expiry Date"
        value={formData.licenseExpiryDate || ""}
        onChange={handleInputChange("licenseExpiryDate")}
        error={errors.licenseExpiryDate}
        isInvalid={!!errors.licenseExpiryDate}
        // min={formData.licenseIssueDate || undefined}
        isRequired
      />
    </div>
  );
};
