import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useUpdatePasswordMutation } from "../../services/authApi";
import { useUpdatePasswordForm } from "../../hooks/useAuthForm";
import { FaRegEye, FaRegEyeSlash, FaLock } from "react-icons/fa";
import type { UpdatePasswordFormProps } from "./UpdatePasswordForm.types";
import LogoText from "@/../public/SteeriGoHorizontal.png";
import { IoIosArrowBack } from "react-icons/io";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
    className = "",
    isLoading = false,
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [updatePassword] = useUpdatePasswordMutation();

    const {
        formData,
        errors,
        isSubmitting,
        submitMessage,
        handleChange,
        handleSubmit,
    } = useUpdatePasswordForm(async (data: any) => {
        try {
          const res = await updatePassword(data).unwrap();
          if (res.success) {
            setTimeout(async () => {
              await logout();
              navigate("/login", { state: { message: res.message } });
            }, 2000);
          }
          return res;
        } catch (error: unknown) {
          return {
            success: false,
            message: getErrorMessage(error, "Failed to update password"),
          };
        }
    });

    return (
        <div className={`w-full max-w-sm mx-auto ${className}`}>
            <div className="text-center mb-8">
                <img src={LogoText} alt="" className="w-3/4 mx-auto mb-2" />
                <h2 className="text-xl font-semibold">Update Password</h2>
            </div>

            {submitMessage && (
                <div
                    className={`p-3 mb-4 rounded text-sm ${submitMessage.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200 border"
                        : "bg-red-50 text-red-800 border-red-200 border"
                        }`}
                >
                    {submitMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type={showCurrent ? "text" : "password"}
                    id="currentPassword"
                    label="Current Password"
                    value={formData.currentPassword || ""}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                    error={errors.currentPassword}
                    isInvalid={!!errors.currentPassword}
                    disabled={isSubmitting || isLoading}
                    placeholder="Enter current password"
                    leftIcon={<FaLock className="w-4 h-4 text-gray-400" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowCurrent((v) => !v)}
                            className="focus:outline-none"
                            disabled={isSubmitting || isLoading}
                        >
                            {showCurrent ? (
                                <FaRegEyeSlash className="text-gray-500" />
                            ) : (
                                <FaRegEye className="text-gray-500" />
                            )}
                        </button>
                    }
                />

                <Input
                    type={showNew ? "text" : "password"}
                    id="newPassword"
                    label="New Password"
                    value={formData.newPassword || ""}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    error={errors.newPassword}
                    isInvalid={!!errors.newPassword}
                    disabled={isSubmitting || isLoading}
                    placeholder="Enter new password"
                    leftIcon={<FaLock className="w-4 h-4 text-gray-400" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowNew((v) => !v)}
                            className="focus:outline-none"
                            disabled={isSubmitting || isLoading}
                        >
                            {showNew ? (
                                <FaRegEyeSlash className="text-gray-500" />
                            ) : (
                                <FaRegEye className="text-gray-500" />
                            )}
                        </button>
                    }
                />

                <Input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                    isInvalid={!!errors.confirmPassword}
                    disabled={isSubmitting || isLoading}
                    placeholder="Confirm new password"
                    leftIcon={<FaLock className="w-4 h-4 text-gray-400" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="focus:outline-none"
                            disabled={isSubmitting || isLoading}
                        >
                            {showConfirm ? (
                                <FaRegEyeSlash className="text-gray-500" />
                            ) : (
                                <FaRegEye className="text-gray-500" />
                            )}
                        </button>
                    }
                />

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isSubmitting || isLoading}
                    disabled={isSubmitting || isLoading}
                >
                    Update Password
                </Button>
            </form>

            <div className="text-center mt-6">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                    <IoIosArrowBack className="mr-1" /> Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

