import React, { useRef, useState } from "react";
import { MdUploadFile, MdEdit } from "react-icons/md";
import { Alert } from "@/shared/components/ui/Alert";

interface ProfilePictureUploadProps {
  currentImage?: string;
  initials: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  initials,
  onUpload,
  isLoading = false,
  disabled = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    setSuccess(null);

    if (!validateFile(file)) {
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
      setSuccess("Profile picture updated successfully");
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload profile picture");
      setPreviewUrl(null);
    }
  };

  const handleClick = () => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <div
        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden cursor-pointer group bg-gray-200"
        onClick={handleClick}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-semibold">
            {initials}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full overflow-hidden">
          <div className="flex flex-col items-center text-white gap-1">
            {isLoading ? (
              <div className="animate-spin">
                <MdUploadFile size={24} />
              </div>
            ) : (
              <>
                <MdEdit size={24} />
                <span className="text-xs text-gray-900 font-medium drop-shadow-sm">
                  Change Photo
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
        disabled={isLoading || disabled}
      />
    </div>
  );
};
