import React, { useRef, useState } from "react";
import { useFileUpload } from "../../hooks/useFileUpload";

interface FileUploadComponentProps {
  fieldName: string;
  label: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
  currentFile?: File | string | null;
  onFileSelect: (file: File, fieldName: string) => void;
  onFileRemove?: (fieldName: string) => void;
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  fieldName,
  label,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  required = false,
  currentFile,
  onFileSelect,
  onFileRemove,
  error,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { validateFile, getFilePreview, formatFileSize } = useFileUpload({
    accept,
    maxSize,
  });

  //   const handleFileSelect = (files: File[]) => {
  //     if (files.length > 0) {
  //       const file = files;
  //       const validation = validateFile(file);

  //       if (validation.isValid) {
  //         onFileSelect(file, fieldName);
  //       }
  //     }
  //   };

  const handleFileSelect = (files: File[]) => {
    // for dev
    if (files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);

      if (validation.isValid) {
        onFileSelect(file, fieldName);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFileSelect(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleRemoveFile = () => {
    if (onFileRemove) {
      onFileRemove(fieldName);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasFile =
    currentFile instanceof File ||
    (typeof currentFile === "string" && currentFile);
  const isImage =
    currentFile instanceof File && currentFile.type.startsWith("image/");
  const previewUrl =
    currentFile instanceof File
      ? getFilePreview(currentFile)
      : typeof currentFile === "string"
      ? currentFile
      : null;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Upload Area */}
      {!hasFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragOver
              ? "border-gray-700 bg-gray-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="space-y-2">
            <svg
              className="w-8 h-8 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700 hover:text-gray-900">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>

            <p className="text-xs text-gray-500">
              {accept.includes("image") ? "PNG, JPG, JPEG" : accept} up to{" "}
              {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      )}

      {/* File Preview */}
      {hasFile && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Image Preview */}
              {isImage && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}

              {/* File Info */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentFile instanceof File
                    ? currentFile.name
                    : "Uploaded file"}
                </p>
                {currentFile instanceof File && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(currentFile.size)}
                  </p>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-800 transition-colors"
              disabled={isUploading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
