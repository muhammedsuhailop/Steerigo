import React, { useRef, useState, useEffect } from "react";
import { MdUploadFile, MdEdit } from "react-icons/md";
import { Alert } from "@/shared/components/ui/Alert";

interface ProfilePictureUploadProps {
  currentImage?: string;
  initials: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  initials,
  onUpload,
  isLoading = false,
  disabled = false,
  className = "",
  onUploadSuccess,
  onUploadError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      setError("File size must be less than 2MB");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      return false;
    }

    return true;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    if (!validateFile(file)) {
      setIsUploading(false);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await onUpload(file);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (err: any) {
      console.error("Upload error:", err);

      const errorMessage = err?.message || "Failed to upload profile picture";
      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        setError(errorMessage);
      }

      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !isLoading && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = previewUrl || currentImage;
  const isUploadingNow = isUploading || isLoading;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div
        className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 ${
          !isUploadingNow && !disabled ? "cursor-pointer" : "cursor-not-allowed"
        } group`}
        onClick={handleClick}
        role="button"
        tabIndex={!isUploadingNow && !disabled ? 0 : -1}
        onKeyDown={(e) => {
          if (
            (e.key === "Enter" || e.key === " ") &&
            !isUploadingNow &&
            !disabled
          ) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload profile picture"
      >
        {/* Image or Initials */}
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-semibold">
            {initials}
          </div>
        )}

        {/* Overlay on hover  */}
        {!isUploadingNow && (
          <div
            className="absolute inset-0 bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div className="flex flex-col items-center text-white gap-1">
              <MdEdit size={24} />
              <span className="text-xs text-gray-900 font-medium drop-shadow-sm">
                Change Photo
              </span>
            </div>
          </div>
        )}

        {/* Loading spinner - show only during upload */}
        {isUploadingNow && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <div className="animate-spin">
              <MdUploadFile size={24} className="text-white" />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploadingNow || disabled}
        aria-label="Upload profile picture"
      />
    </div>
  );
};
