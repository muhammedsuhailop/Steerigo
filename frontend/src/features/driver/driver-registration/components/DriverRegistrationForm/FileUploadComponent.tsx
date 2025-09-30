import React, { useRef, useState } from "react";
import {
  MdCloudUpload,
  MdDescription,
  MdDelete,
  MdErrorOutline,
  MdCheckCircle,
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
  onFileUpload?: (url: string, fieldName: string) => void;
  onFileRemove?: (fieldName: string) => void;
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  fieldName,
  label,
  accept = "image/*",
  maxSize = 2 * 1024 * 1024,
  required = false,
  currentFile,
  onFileSelect,
  onFileUpload,
  onFileRemove,
  error,
  isUploading: externalUploading = false,
  uploadProgress: externalProgress = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const {
    validateFile,
    getFilePreview,
    formatFileSize,
    uploadToBackend,
    isUploading: hookUploading,
    uploadProgress: hookProgress,
  } = useFileUpload({
    accept,
    maxSize,
    onSuccess: (result) => {
      setUploadSuccess(true);
      onFileUpload?.(result.data.url, fieldName);
      setTimeout(() => setUploadSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const isCurrentlyUploading = externalUploading || hookUploading;
  const currentProgress = externalUploading ? externalProgress : hookProgress;

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);

      if (validation.isValid) {
        onFileSelect(file, fieldName);

        await uploadToBackend(file, fieldName);
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
    setUploadSuccess(false);
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
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
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
            disabled={isCurrentlyUploading}
          />

          <div className="space-y-4">
            <MdCloudUpload className="w-8 h-8 text-gray-400 mx-auto" />

            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept.includes("image") ? "PNG, JPG, JPEG" : accept} up to{" "}
                {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Preview */}
      {hasFile && (
        <div className="border border-gray-200 rounded-lg p-4">
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
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                  <MdDescription className="w-6 h-6 text-gray-400" />
                </div>
              )}

              {/* File Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
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

            {/* Success/Remove Button */}
            <div className="flex items-center space-x-2">
              {uploadSuccess && (
                <MdCheckCircle className="w-5 h-5 text-green-500" />
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={isCurrentlyUploading}
              >
                <MdDelete className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {isCurrentlyUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Uploading...</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <MdErrorOutline className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <MdCheckCircle className="w-4 h-4" />
          <span>File uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};
