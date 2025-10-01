import { useState, useCallback } from "react";
import { useUploadFileMutation } from "../services/driverRegistrationApi";
import { FILE_UPLOAD_PURPOSES } from "../types/driverRegistration.types";

interface FileUploadOptions {
  accept?: string;
  maxSize?: number;
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
    maxSize = 2 * 1024 * 1024,
    maxFiles = 1,
    onProgress,
    onError,
    onSuccess,
  } = options;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      if (file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return {
          isValid: false,
          error: `File size must be less than ${sizeMB}MB`,
        };
      }

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

      if (files.length > maxFiles) {
        const error = `Maximum ${maxFiles} file${
          maxFiles > 1 ? "s" : ""
        } allowed`;
        onError?.(error);
        return [];
      }

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

      const changeEvent = {
        target: { files } as unknown as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>;

      return handleFileSelect(changeEvent);
    },
    [handleFileSelect]
  );

  const uploadToBackend = useCallback(
    async (file: File, fieldName: string): Promise<FileUploadResult> => {
      try {
        setUploadProgress(0);

        const purpose =
          FILE_UPLOAD_PURPOSES[
            fieldName as keyof typeof FILE_UPLOAD_PURPOSES
          ] || "document";

        const result = await uploadFile({ file, purpose }).unwrap();

        setUploadProgress(100);

        setTimeout(() => {
          setUploadProgress(0);
        }, 500);

        onSuccess?.(result);

        return {
          success: true,
          url: result.data.url,
        };
      } catch (error: any) {
        setUploadProgress(0);

        const errorMessage =
          error?.data?.message || error?.message || "Upload failed";
        onError?.(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [uploadFile, onSuccess, onError]
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
    isUploading: isUploadingFile,
    uploadProgress,
    uploadedFiles,

    // File handling
    handleFileSelect,
    handleDrop,
    removeFile,
    clearFiles,

    // Upload
    validateFile,
    uploadToBackend,

    // Utilities
    getFilePreview,
    formatFileSize,
  };
};
