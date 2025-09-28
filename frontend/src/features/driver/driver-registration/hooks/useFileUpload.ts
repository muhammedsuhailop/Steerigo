import { useState, useCallback } from "react";

interface FileUploadOptions {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  onSuccess?: (result: any) => void;
}

interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const {
    accept = "image/*",
    maxSize = 5 * 1024 * 1024, // 5MB default
    maxFiles = 1,
    onProgress,
    onError,
    onSuccess,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return {
          isValid: false,
          error: `File size must be less than ${sizeMB}MB`,
        };
      }

      // Check file type
      if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
        return {
          isValid: false,
          error: `File type not supported. Accepted: ${accept}`,
        };
      }

      return { isValid: true };
    },
    [maxSize, accept]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): File[] => {
      const files = Array.from(event.target.files || []);

      // Check max files limit
      if (files.length > maxFiles) {
        const error = `Maximum ${maxFiles} file${
          maxFiles > 1 ? "s" : ""
        } allowed`;
        onError?.(error);
        return [];
      }

      // Validate each file
      const validFiles: File[] = [];
      for (const file of files) {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          onError?.(validation.error || "Invalid file");
          break;
        }
      }

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles]);
      }

      return validFiles;
    },
    [maxFiles, validateFile, onError]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>): File[] => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);

      // Create synthetic change event
      const changeEvent = {
        target: { files } as unknown as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>;

      return handleFileSelect(changeEvent);
    },
    [handleFileSelect]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress(0);
  }, []);

  const getFilePreview = useCallback((file: File): string | null => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    uploadedFiles,

    // File handling
    handleFileSelect,
    handleDrop,
    removeFile,
    clearFiles,

    // Upload
    validateFile,

    // Utilities
    getFilePreview,
    formatFileSize,
  };
};
