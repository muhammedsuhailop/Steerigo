import React, { useRef, useState } from "react";
import {
  MdCloudUpload,
  MdDescription,
  MdDelete,
  MdErrorOutline,
} from "react-icons/md";
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
            <MdCloudUpload className="w-8 h-8 mx-auto text-gray-400" />

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
                  <MdDescription className="w-6 h-6 text-gray-400" />
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
              <MdDelete className="w-5 h-5" />
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
          <MdErrorOutline className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
