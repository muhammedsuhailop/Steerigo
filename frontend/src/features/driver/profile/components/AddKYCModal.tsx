import React, { useState } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Alert } from "@/shared/components/ui/Alert";
import { FaTimes, FaSave, FaCheck } from "react-icons/fa";
import { Input } from "@/shared/components/ui";
import { FileUploadComponent } from "@/features/driver/driver-registration/components/DriverRegistrationForm/FileUploadComponent";
import { useAddKYCDocument } from "../hooks/useAddKYCDocument";
import { AddKYCModalProps, ImageData } from "../types/driverProfile.types";

const DOC_TYPE_OPTIONS = ["License", "Aadhaar", "PAN"];
const LICENSE_CATEGORIES = ["LMV", "HMV", "HGMV", "PSV", "Auto"];

export const AddKYCModal: React.FC<AddKYCModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addDocument, isLoading, error } = useAddKYCDocument();

  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [formData, setFormData] = useState({
    docNumber: "",
    licenseCategory: "",
    issueDate: "",
    expiryDate: "",
  });

  const [frontImageData, setFrontImageData] = useState<ImageData | null>(null);
  const [backImageData, setBackImageData] = useState<ImageData | null>(null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFrontImageUpload = (
    url: string,
    fieldName: string,
    fullResponse?: any
  ) => {
    if (fullResponse?.publicId) {
      setFrontImageData({
        url: fullResponse.url || url,
        publicId: fullResponse.publicId,
      });
    } else {
      console.warn("No publicId in response");
    }
  };

  const handleBackImageUpload = (
    url: string,
    fieldName: string,
    fullResponse?: any
  ) => {
    if (fullResponse?.publicId) {
      setBackImageData({
        url: fullResponse.url || url,
        publicId: fullResponse.publicId,
      });
    } else {
      console.warn("No publicId in response");
    }
  };

  const handleFileSelect = (file: File, fieldName: string) => {
    if (fieldName === "Front Image") {
      setFrontImageFile(file);
    } else if (fieldName === "Back Image") {
      setBackImageFile(file);
    }
  };

  const handleFileRemove = (fieldName: string) => {
    if (fieldName === "Front Image") {
      setFrontImageFile(null);
      setFrontImageData(null);
    } else if (fieldName === "Back Image") {
      setBackImageFile(null);
      setBackImageData(null);
    }
  };

  const validateForm = (): boolean => {
    if (!selectedDocType) {
      setLocalError("Please select document type");
      return false;
    }

    if (!formData.docNumber.trim()) {
      setLocalError("Document number is required");
      return false;
    }

    if (selectedDocType === "License" && !formData.licenseCategory) {
      setLocalError("License category is required");
      return false;
    }

    if (!formData.issueDate) {
      setLocalError("Issue date is required");
      return false;
    }

    if (formData.expiryDate) {
      if (new Date(formData.issueDate) >= new Date(formData.expiryDate)) {
        setLocalError("Expiry date must be after issue date");
        return false;
      }
    }

    if (!frontImageData?.publicId) {
      setLocalError("Please upload front image first");
      return false;
    }

    if (!backImageData?.publicId) {
      setLocalError("Please upload back image first");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      docType: selectedDocType,
      docNumber: formData.docNumber,
      ...(selectedDocType === "License" && {
        licenseCategory: formData.licenseCategory,
      }),
      issueDate: new Date(formData.issueDate).toISOString(),
      ...(formData.expiryDate && {
        expiryDate: new Date(formData.expiryDate).toISOString(),
      }),
      frontImageUrls: [frontImageData!.publicId],
      backImageUrls: [backImageData!.publicId],
    };

    const result = await addDocument(payload);

    if (result.success) {
      resetForm();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const resetForm = () => {
    setSelectedDocType("");
    setFormData({
      docNumber: "",
      licenseCategory: "",
      issueDate: "",
      expiryDate: "",
    });
    setFrontImageData(null);
    setBackImageData(null);
    setFrontImageFile(null);
    setBackImageFile(null);
    setLocalError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl border border-gray-100 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Add KYC Document
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Error Alert */}
          {(localError || error) && (
            <div className="mb-6">
              <Alert
                type="danger"
                message={localError || error || undefined}
                onClose={() => setLocalError(null)}
              />
            </div>
          )}

          {/* Document Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Document Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DOC_TYPE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedDocType(option);
                    setLocalError(null);
                  }}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    selectedDocType === option
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {option === "License" ? "Driving License" : option}
                </button>
              ))}
            </div>
          </div>

          {selectedDocType && (
            <div className="space-y-6">
              {/* Document Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Document Number *
                </label>
                <Input
                  type="text"
                  name="docNumber"
                  value={formData.docNumber}
                  onChange={handleInputChange}
                  placeholder={`Enter ${selectedDocType} number`}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* License Category (only for License) */}
              {selectedDocType === "License" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    License Category *
                  </label>
                  <select
                    name="licenseCategory"
                    value={formData.licenseCategory}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {LICENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Issue Date *
                  </label>
                  <Input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Front Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Front Image *
                  {frontImageData?.publicId && (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-medium">
                      <FaCheck size={14} /> Uploaded
                    </span>
                  )}
                </label>
                <FileUploadComponent
                  label="Upload Front Image"
                  accept="image/*"
                  maxSize={5242880}
                  onFileSelect={(file) => handleFileSelect(file, "Front Image")}
                  onFileUpload={(url, fieldName, fullResponse) =>
                    handleFrontImageUpload(url, fieldName, fullResponse)
                  }
                  onFileRemove={(fieldName) => handleFileRemove(fieldName)}
                  currentFile={frontImageFile}
                  fieldName="Front Image"
                />
              </div>

              {/* Back Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Back Image *
                  {backImageData?.publicId && (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-medium">
                      <FaCheck size={14} /> Uploaded
                    </span>
                  )}
                </label>
                <FileUploadComponent
                  label="Upload Back Image"
                  accept="image/*"
                  maxSize={5242880}
                  onFileSelect={(file) => handleFileSelect(file, "Back Image")}
                  onFileUpload={(url, fieldName, fullResponse) =>
                    handleBackImageUpload(url, fieldName, fullResponse)
                  }
                  onFileRemove={(fieldName) => handleFileRemove(fieldName)}
                  currentFile={backImageFile}
                  fieldName="Back Image"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaTimes size={16} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <FaSave size={16} />
                  {isLoading ? "Submitting..." : "Submit KYC"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
