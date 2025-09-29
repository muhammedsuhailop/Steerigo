import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { MdErrorOutline } from "react-icons/md";

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
            <MdErrorOutline className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please review and resolve the following errors:
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
