import React, { useEffect, useRef, useState } from "react";
import { Input, Select, DateInput, TextArea } from "@/shared/components/ui";
import { useDriverRegistration } from "../../../hooks/useDriverRegistration";
import { yearsBeforeDate } from "@/features/driver/shared/utils/dateHelpers";
import { getPincodeDetails } from "../../../services/pincodeService";
import { MdErrorOutline } from "react-icons/md";

export const PersonalInfoStep: React.FC = () => {
  const { formData, updateData, errors } = useDriverRegistration();
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const hasErrors = Object.keys(errors).length > 0;

  // const lastFetchedPinRef = useRef<string | null>(null);

  // useEffect(() => {
  //   const pin = formData.pin;
  //   if (/^\d{6}$/.test(pin) && pin !== lastFetchedPinRef.current) {
  //     setLoadingPin(true);
  //     setPinError(null);
  //     lastFetchedPinRef.current = pin;

  //     getPincodeDetails(pin).then((res) => {
  //       setLoadingPin(false);
  //       if (res.success) {
  //         updateData({ state: res.data.state });
  //       } else {
  //         setPinError(res.error);
  //       }
  //     });
  //   }
  // }, [formData.pin]);

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
            <MdErrorOutline className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please review and resolve the following errors:
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

      {/* PIN Code */}
      <Input
        label="PIN Code"
        name="pin"
        value={formData.pin || ""}
        onChange={handleInputChange("pin")}
        error={errors.pin || pinError}
        isInvalid={!!errors.pin}
        placeholder="Enter your postal code"
        maxLength={6}
        isRequired
      />
      {loadingPin && <p className="text-sm text-gray-500">Looking up PIN…</p>}

      {/* State */}
      <Select
        label="State"
        name="state"
        value={formData.state || ""}
        onChange={handleInputChange("state")}
        options={stateOptions}
        error={errors.state}
        isInvalid={!!pinError || !!errors.state}
        isRequired
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address <span className="text-red-500">*</span>
        </label>
        <TextArea
          value={formData.address || ""}
          onChange={(e: { target: { value: any } }) =>
            updateData({ address: e.target.value })
          }
          rows={3}
          placeholder="Enter your complete address"
          name="addres"
          error={errors.address}
        />
      </div>
    </div>
  );
};
