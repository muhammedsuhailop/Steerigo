import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Input, Select } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui/Button";
import { Alert } from "@/shared/components/ui/Alert";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { FaSave, FaTimes, FaPencilAlt } from "react-icons/fa";
import type { DriverProfileDetailsProps } from "../types/driverProfile.types";

export const DriverProfileDetails: React.FC<
  DriverProfileDetailsProps & {
    editMode?: boolean;
    onEditModeChange?: (value: boolean) => void;
  }
> = ({ profile, isLoading = false, editMode = false, onEditModeChange }) => {
  const { updateProfile, isUpdating, error } = useDriverProfile();

  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    mobile: profile.mobile || "",
    dob: profile.dob?.split("T")[0] || "",
    gender: profile.gender || "",
    address: profile.address || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      mobile: profile.mobile || "",
      dob: profile.dob?.split("T")[0] || "",
      gender: profile.gender || "",
      address: profile.address || "",
    });
    setIsDirty(false);
  }, [profile, editMode]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format";

    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\+?\d{10,15}$/.test(formData.mobile.replace(/[^\d]/g, "")))
      errors.mobile = "Invalid mobile number";

    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await updateProfile({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      dob: new Date(formData.dob).toISOString(),
      gender: formData.gender,
      address: formData.address,
    });

    if (result.success) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
      if (onEditModeChange) onEditModeChange(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (!confirmed) return;
    }
    if (onEditModeChange) onEditModeChange(false);
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const lastUpdated = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString()
    : "-";

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated}
            </p>
          </div>

          {!editMode && onEditModeChange && (
            <button
              onClick={() => {
                if (onEditModeChange) onEditModeChange(true);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <FaPencilAlt className="text-gray-500" size={16} />
            </button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} />
          </div>
        )}
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} />
          </div>
        )}

        {editMode ? (
          // Edit Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  disabled={isLoading || isUpdating}
                  className={`rounded-lg border ${
                    formErrors.name ? "border-rose-500" : "border-gray-200"
                  } px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.name && (
                  <p className="text-rose-500 text-xs mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  disabled={isLoading || isUpdating}
                  className={`rounded-lg border ${
                    formErrors.email ? "border-rose-500" : "border-gray-200"
                  } px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.email && (
                  <p className="text-rose-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  disabled={isLoading || isUpdating}
                  className={`rounded-lg border ${
                    formErrors.mobile ? "border-rose-500" : "border-gray-200"
                  } px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.mobile && (
                  <p className="text-rose-500 text-xs mt-1">
                    {formErrors.mobile}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={isLoading || isUpdating}
                  className={`rounded-lg border ${
                    formErrors.dob ? "border-rose-500" : "border-gray-200"
                  } px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.dob && (
                  <p className="text-rose-500 text-xs mt-1">{formErrors.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isLoading || isUpdating}
                  options={genderOptions}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                disabled={isLoading || isUpdating}
                className={`rounded-lg border ${
                  formErrors.address ? "border-rose-500" : "border-gray-200"
                } px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formErrors.address && (
                <p className="text-rose-500 text-xs mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaTimes size={16} />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || !isDirty}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <FaSave size={16} />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {profile.name}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-base text-gray-900 font-medium break-all">
                  {profile.email}
                </p>
              </div>

              {/* Mobile */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Mobile Number
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {profile.mobile}
                </p>
              </div>

              {/* DOB */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Date of Birth
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {profile.dob
                    ? new Date(profile.dob).toLocaleDateString("en-IN")
                    : "-"}
                </p>
              </div>

              {/* Gender */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Gender
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {profile.gender || "-"}
                </p>
              </div>
            </div>

            {/* Address  */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Address
              </p>
              <p className="text-base text-gray-900 font-medium leading-relaxed">
                {profile.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
