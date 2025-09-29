import React from "react";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { FileUploadComponent } from "../FileUploadComponent";

export const DocumentsStep: React.FC = () => {
  const {
    formData,
    updateData,
    errors,
    uploadProgress,
    isLoading,
    handleDocumentUpload,
  } = useDriverRegistration();

  const handleFileSelect = async (file: File, fieldName: string) => {
    const result = await handleDocumentUpload(file, fieldName);

    if (result.success) {
      updateData({ [fieldName]: result.url || file });
    }
  };

  const handleFileRemove = (fieldName: string) => {
    updateData({ [fieldName]: null });
  };

  const documentFields = [
    {
      fieldName: "licenseFrontImage",
      label: "License Front Image",
      required: true,
    },
    {
      fieldName: "licenseBackImage",
      label: "License Back Image",
      required: true,
    },
    {
      fieldName: "idFrontImage",
      label: "ID Front Image",
      required: true,
    },
    {
      fieldName: "idBackImage",
      label: "ID Back Image",
      required: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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
              Document Upload Instructions
            </h3>
            <div className="text-sm text-blue-700 mt-1">
              <ul className="list-disc list-inside space-y-1">
                <li>Upload clear, high-quality images of your documents</li>
                <li>
                  Ensure all text is readable and document corners are visible
                </li>
                <li>Accepted formats: JPG, PNG (max 5MB each)</li>
                <li>Documents should not be expired</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Fields */}
      {documentFields.map((field) => (
        <FileUploadComponent
          key={field.fieldName}
          fieldName={field.fieldName}
          label={field.label}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          required={field.required}
          currentFile={(formData as any)[field.fieldName]}
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          error={errors[field.fieldName]}
          isUploading={isLoading}
          uploadProgress={uploadProgress[field.fieldName] || 0}
        />
      ))}

      {/* Upload Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Upload Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {documentFields.map((field) => {
            const hasFile = !!(formData as any)[field.fieldName];
            return (
              <div
                key={field.fieldName}
                className="flex items-center space-x-2"
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    hasFile ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  {hasFile && (
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
                  className={`text-sm ${
                    hasFile ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  {field.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
