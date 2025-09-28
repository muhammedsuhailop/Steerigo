import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";

export const IdInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateData({ [field]: event.target.value });
    };

  const idTypeOptions = [
    { value: "", label: "Select ID Type" },
    { value: "Aadhaar", label: "Aadhaar Card" },
    { value: "Passport", label: "Passport" },
    { value: "Voter ID", label: "Voter ID" },
    { value: "PAN Card", label: "PAN Card" },
  ];

  const getIdNumberPlaceholder = () => {
    switch (formData.idType) {
      case "Aadhaar":
        return "1234-5678-9012";
      case "Passport":
        return "A1234567";
      case "Voter ID":
        return "ABC1234567";
      case "PAN Card":
        return "ABCDE1234F";
      default:
        return "Enter ID number";
    }
  };

  return (
    <div className="space-y-6">
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
        placeholder={getIdNumberPlaceholder()}
        isRequired
      />

      {/* ID Issue Date */}
      <DateInput
        label="ID Issue Date"
        value={formData.idIssueDate || ""}
        onChange={handleInputChange("idIssueDate")}
        error={errors.idIssueDate}
        isInvalid={!!errors.idIssueDate}
        // max={new Date().toISOString().split("T")}
        isRequired
      />

      {/* ID Expiry Date */}
      <DateInput
        label="ID Expiry Date"
        value={formData.idExpiryDate || ""}
        onChange={handleInputChange("idExpiryDate")}
        error={errors.idExpiryDate}
        isInvalid={!!errors.idExpiryDate}
        // min={formData.idIssueDate || undefined}
        isRequired
      />

      {/* ID Information */}
      {formData.idType && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-400 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                {formData.idType} Information
              </h3>
              <div className="text-sm text-blue-700 mt-1">
                {formData.idType === "Aadhaar" && (
                  <p>
                    Please enter your Aadhaar number in XXXX-XXXX-XXXX format
                  </p>
                )}
                {formData.idType === "Passport" && (
                  <p>Please enter your passport number (e.g., A1234567)</p>
                )}
                {formData.idType === "Voter ID" && (
                  <p>Please enter your Voter ID number</p>
                )}
                {formData.idType === "PAN Card" && (
                  <p>Please enter your PAN number in ABCDE1234F format</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
