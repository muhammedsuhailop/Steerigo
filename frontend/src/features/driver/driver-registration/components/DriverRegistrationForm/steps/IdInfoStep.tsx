import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";

export const IdInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();
  const hasErrors = Object.keys(errors).length > 0;

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateData({ [field]: event.target.value });
    };

  const idTypeOptions = [
    { value: "", label: "Select ID Type" },
    { value: "Aadhaar", label: "Aadhaar Card" },
    { value: "Passport", label: "Passport" },
    { value: "PAN", label: "PAN Card" },
  ];

  return (
    <div className="space-y-6">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{String(message)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ID Type */}
      <Select
        label="ID Type"
        value={formData.idType || ""}
        onChange={handleInputChange("idType")}
        options={idTypeOptions}
        error={errors.idType}
        isInvalid={!!errors.idType}
        isRequired
      />

      {/* ID Number */}
      <Input
        label="ID Number"
        value={formData.idNumber || ""}
        onChange={handleInputChange("idNumber")}
        error={errors.idNumber}
        isInvalid={!!errors.idNumber}
        placeholder="Enter your ID number"
        isRequired
      />

      {/* ID Issue Date */}
      <DateInput
        label="ID Issue Date"
        value={formData.idIssueDate || ""}
        onChange={handleInputChange("idIssueDate")}
        error={errors.idIssueDate}
        isInvalid={!!errors.idIssueDate}
        max={new Date().toISOString().split("T")[0]}
        isRequired
      />

      {/* ID Expiry Date */}
      <DateInput
        label="ID Expiry Date"
        value={formData.idExpiryDate || ""}
        onChange={handleInputChange("idExpiryDate")}
        error={errors.idExpiryDate}
        isInvalid={!!errors.idExpiryDate}
        min={formData.idIssueDate || undefined}
        isRequired
      />
    </div>
  );
};
