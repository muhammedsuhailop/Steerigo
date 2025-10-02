import React, { useState, useEffect } from "react";
import { MdErrorOutline, MdSave, MdCancel } from "react-icons/md";
import { Input, Select, TextArea } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Alert } from "@/shared/components/ui/Alert";
import type { UpdateProfileFormProps } from "./UpdateProfileForm.types";
import type { UserProfileFormData } from "../../types/userProfile.types";

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  profile,
  onSave,
  onCancel,
  isLoading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: profile.name,
    email: profile.email,
    mobile: profile.mobile,
    dateOfBirth: profile.dateOfBirth || "",
    gender: profile.gender || ("" as "Male" | "Female" | "Other"),
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pincode || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form when profile changes
  useEffect(() => {
    setFormData({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      dateOfBirth: profile.dateOfBirth || "",
      gender: profile.gender || ("" as "Male" | "Female" | "Other"),
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
    });
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Optional field validations
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "PIN code must be 6 digits";
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 18 || age > 100) {
        errors.dateOfBirth = "Age must be between 18 and 100 years";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmCancel) return;
    }
    onCancel();
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const stateOptions = [
    { value: "", label: "Select State" },
    { value: "Kerala", label: "Kerala" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Telangana", label: "Telangana" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Delhi", label: "Delhi" },
    { value: "Punjab", label: "Punjab" },
    { value: "Haryana", label: "Haryana" },
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-6">
            <MdErrorOutline className="w-5 h-5" />
            <div>
              <h4 className="font-semibold">Update Failed</h4>
              <p>{error}</p>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                isRequired
                disabled={isLoading}
                placeholder="Enter your full name"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                isRequired
                disabled={isLoading}
                placeholder="Enter your email"
              />

              <Input
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                error={formErrors.mobile}
                isRequired
                disabled={isLoading}
                placeholder="Enter your mobile number"
                maxLength={10}
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={formErrors.dateOfBirth}
                disabled={isLoading}
                max={new Date().toISOString().split("T")[0]}
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={genderOptions}
                error={formErrors.gender}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Address Information
            </h3>

            <div className="space-y-6">
              <TextArea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={formErrors.address}
                disabled={isLoading}
                placeholder="Enter your complete address"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={formErrors.city}
                  disabled={isLoading}
                  placeholder="Enter your city"
                />

                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={stateOptions}
                  error={formErrors.state}
                  disabled={isLoading}
                />

                <Input
                  label="PIN Code"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  error={formErrors.pincode}
                  disabled={isLoading}
                  placeholder="Enter PIN code"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              leftIcon={<MdSave />}
              isLoading={isLoading}
              disabled={!isDirty || isLoading}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              leftIcon={<MdCancel />}
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
