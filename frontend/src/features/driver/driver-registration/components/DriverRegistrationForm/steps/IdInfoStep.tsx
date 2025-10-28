import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { DOCUMENT_TYPES } from "../../../constants/valueObjects";
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
    ...DOCUMENT_TYPES.map((doc) => ({
      value: doc.value,
      label: doc.label,
    })),
  ];

  return (
    <div className="space-y-6">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <MdErrorOutline className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please review and resolve the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{String(message)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <Select
        label="ID Type"
        name="idType"
        value={formData.idType || ""}
        onChange={handleInputChange("idType")}
        options={idTypeOptions}
        error={errors.idType}
        isInvalid={!!errors.idType}
        isRequired
      />

      <Input
        label="ID Number"
        name="idNumber"
        value={formData.idNumber || ""}
        onChange={handleInputChange("idNumber")}
        error={errors.idNumber}
        isInvalid={!!errors.idNumber}
        placeholder={
          formData.idType === "PAN"
            ? "Enter PAN number (e.g., ABCDE1234F)"
            : formData.idType === "Aadhaar"
            ? "Enter 12-digit Aadhaar number"
            : "Enter ID number"
        }
        isRequired
      />

      <DateInput
        label="ID Issue Date"
        name="idIssueDate"
        value={formData.idIssueDate || ""}
        onChange={handleInputChange("idIssueDate")}
        error={errors.idIssueDate}
        isInvalid={!!errors.idIssueDate}
        max={new Date().toISOString().split("T")[0]}
        isRequired
      />

      <DateInput
        label="ID Expiry Date"
        name="idExpiryDate"
        value={formData.idExpiryDate || ""}
        onChange={handleInputChange("idExpiryDate")}
        error={errors.idExpiryDate}
        isInvalid={!!errors.idExpiryDate}
        min={formData.idIssueDate || new Date().toISOString().split("T")[0]}
        isRequired
      />

      {formData.idType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong>
            {formData.idType === "PAN" && (
              <span>
                {" "}
                PAN cards are generally valid for a lifetime. Leave this field
                empty if no expiry date is specified.
              </span>
            )}
            {formData.idType === "Aadhaar" && (
              <span>
                {" "}
                Aadhaar cards generally do not have an expiry date. Please leave
                the expiry date field empty unless a specific validity period is
                noted on the card.
              </span>
            )}
            {formData.idType === "DrivingLicense" && (
              <span>
                {" "}
                Driving licenses have a specific and mandatory validity period
                as printed on the document. The expiry date must be entered.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
