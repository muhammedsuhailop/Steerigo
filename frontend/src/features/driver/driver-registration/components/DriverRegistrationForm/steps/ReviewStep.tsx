import React from "react";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { Badge } from "@/shared/components/ui";

export const ReviewStep: React.FC = () => {
  const { formData, goToStep } = useDriverRegistration();

  const handleEditSection = (step: number) => {
    goToStep(step);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <button
            onClick={() => handleEditSection(0)}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>
            <span className="ml-2 font-medium">{formData.name}</span>
          </div>
          <div>
            <span className="text-gray-500">Mobile:</span>
            <span className="ml-2 font-medium">{formData.mobile}</span>
          </div>
          <div>
            <span className="text-gray-500">Date of Birth:</span>
            <span className="ml-2 font-medium">{formData.dob}</span>
          </div>
          <div>
            <span className="text-gray-500">Gender:</span>
            <span className="ml-2 font-medium">{formData.gender}</span>
          </div>
          <div>
            <span className="text-gray-500">State:</span>
            <span className="ml-2 font-medium">{formData.state}</span>
          </div>
          <div>
            <span className="text-gray-500">PIN Code:</span>
            <span className="ml-2 font-medium">{formData.pin}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Address:</span>
            <span className="ml-2 font-medium">{formData.address}</span>
          </div>
        </div>
      </div>

      {/* License Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            License Information
          </h3>
          <button
            onClick={() => handleEditSection(2)}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Category:</span>
            <span className="ml-2 font-medium">{formData.licenseCategory}</span>
          </div>
          <div>
            <span className="text-gray-500">Number:</span>
            <span className="ml-2 font-medium">{formData.licenseNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Issue Date:</span>
            <span className="ml-2 font-medium">
              {formData.licenseIssueDate}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Expiry Date:</span>
            <span className="ml-2 font-medium">
              {formData.licenseExpiryDate}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Body Types:</span>
            <div className="ml-2 flex flex-wrap gap-1 mt-1">
              {formData.licenseBodyTypes?.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Gear Types:</span>
            <div className="ml-2 flex flex-wrap gap-1 mt-1">
              {formData.licenseGearTypes?.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ID Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ID Information
          </h3>
          <button
            onClick={() => handleEditSection(3)}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">ID Type:</span>
            <span className="ml-2 font-medium">{formData.idType}</span>
          </div>
          <div>
            <span className="text-gray-500">ID Number:</span>
            <span className="ml-2 font-medium">{formData.idNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Issue Date:</span>
            <span className="ml-2 font-medium">{formData.idIssueDate}</span>
          </div>
          <div>
            <span className="text-gray-500">Expiry Date:</span>
            <span className="ml-2 font-medium">{formData.idExpiryDate}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <button
            onClick={() => handleEditSection(4)}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { key: "licenseFrontImage", label: "License Front" },
            { key: "licenseBackImage", label: "License Back" },
            { key: "idFrontImage", label: "ID Front" },
            { key: "idBackImage", label: "ID Back" },
          ].map((doc) => (
            <div key={doc.key} className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  (formData as any)[doc.key] ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                {(formData as any)[doc.key] && (
                  <svg
                    className="w-4 h-4 text-white"
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
              <span
                className={`${
                  (formData as any)[doc.key]
                    ? "text-emerald-700"
                    : "text-gray-500"
                }`}
              >
                {doc.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Confirmation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Important</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Please review all information carefully before submitting. Once
              submitted, changes may require additional verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
