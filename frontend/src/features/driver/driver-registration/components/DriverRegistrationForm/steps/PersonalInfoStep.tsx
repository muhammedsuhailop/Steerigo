import React from "react";
import { Input, Select, DateInput } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { yearsBeforeDate } from "@/features/driver/shared/utils/dateHelpers";

export const PersonalInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();
  const hasErrors = Object.keys(errors).length > 0;

  const handleInputChange =
    (field: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      updateData({ [field]: event.target.value });
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
    <div className="space-y-6">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{String(message)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Name */}
      <Input
        label="Full Name"
        name="name"
        value={formData.name || ""}
        onChange={handleInputChange("name")}
        error={errors.name}
        isInvalid={!!errors.name}
        placeholder="Enter your full name"
        isRequired
      />

      {/* Mobile */}
      <Input
        label="Mobile Number"
        name="mobile"
        type="tel"
        value={formData.mobile || ""}
        onChange={handleInputChange("mobile")}
        error={errors.mobile}
        isInvalid={!!errors.mobile}
        placeholder="Enter your mobile number"
        isRequired
      />

      {/* Date of Birth */}
      <DateInput
        label="Date of Birth"
        name="dob"
        value={formData.dob || ""}
        calendarDefaultDate={yearsBeforeDate(20)}
        onChange={handleInputChange("dob")}
        error={errors.dob}
        isInvalid={!!errors.dob}
        max={new Date().toISOString().split("T")[0]}
        isRequired
      />

      {/* Gender */}
      <Select
        label="Gender"
        name="gender"
        value={formData.gender || ""}
        onChange={handleInputChange("gender")}
        options={genderOptions}
        error={errors.gender}
        isInvalid={!!errors.gender}
        isRequired
      />

      {/* State */}
      <Select
        label="State"
        name="state"
        value={formData.state || ""}
        onChange={handleInputChange("state")}
        options={stateOptions}
        error={errors.state}
        isInvalid={!!errors.state}
        isRequired
      />

      {/* PIN Code */}
      <Input
        label="PIN Code"
        name="pin"
        value={formData.pin || ""}
        onChange={handleInputChange("pin")}
        error={errors.pin}
        isInvalid={!!errors.pin}
        placeholder="Enter your postal code"
        maxLength={6}
        isRequired
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.address || ""}
          name="address"
          onChange={handleInputChange("address")}
          rows={3}
          className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 rounded-md focus:border-gray-500 focus:ring-4 focus:ring-gray-100 hover:border-gray-400 transition-all duration-200"
          placeholder="Enter your complete address"
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.address}
          </p>
        )}
      </div>
    </div>
  );
};
