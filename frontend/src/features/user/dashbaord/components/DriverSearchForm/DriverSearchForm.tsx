import React, { useState } from "react";
import { FaCarSide, FaCog, FaCalendarAlt, FaClock } from "react-icons/fa";
import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { DateInput } from "@/shared/components/ui/DateInput";
import type {
  DriverSearchFormProps,
  SearchFormData,
} from "./DriverSearchForm.types";

export const DriverSearchForm: React.FC<DriverSearchFormProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SearchFormData>({
    tripType: "oneway",
    carType: "",
    gearType: "",
    pickupLocation: "",
    dropLocation: "",
    rideDate: "",
    rideTimeWindow: "now",
    timeRequired: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "passengers" ? parseInt(value, 10) || 1 : (value as string),
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, rideDate: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Find Your Driver</h3>

      {/* Trip Type Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, tripType: "oneway" })}
          className={`px-4 py-2 rounded-full ${
            formData.tripType === "oneway"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          One Way
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, tripType: "roundtrip" })}
          className={`px-4 py-2 rounded-full ${
            formData.tripType === "roundtrip"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Round Trip
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Car Type & Gear Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaCarSide className="mr-2" />
              Car Type
            </label>
            <Select
              name="carType"
              value={formData.carType}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select car type" },
                { value: "sedan", label: "Sedan" },
                { value: "suv", label: "SUV" },
                { value: "hatchback", label: "Hatchback" },
              ]}
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaCog className="mr-2" />
              Gear Type
            </label>
            <Select
              name="gearType"
              value={formData.gearType}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select gear type" },
                { value: "automatic", label: "Automatic" },
                { value: "manual", label: "Manual" },
              ]}
              required
            />
          </div>
        </div>

        {/* Pickup & Drop Locations */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaLocationCrosshairs className="mr-2" />
            Pickup Location
          </label>
          <Input
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
            placeholder="Enter pickup location"
            required
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaLocationDot className="mr-2" />
            Drop Location
          </label>
          <Input
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleInputChange}
            placeholder="Enter drop location"
            required
          />
        </div>

        {/* Date & Time Window */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2" />
              Ride Start Date
            </label>
            <DateInput value={formData.rideDate} onChange={handleDateChange} />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaClock className="mr-2" />
              Ride Start Time
            </label>
            <Select
              name="rideTimeWindow"
              value={formData.rideTimeWindow}
              onChange={handleInputChange}
              options={[
                { value: "now", label: "Now" },
                { value: "in15", label: "In 15 min" },
                { value: "in1h", label: "In 1 hour" },
              ]}
            />
          </div>
        </div>

        {/* Time Required & Passengers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <GiSandsOfTime className="mr-2" />
              Time Required
            </label>
            <Select
              name="timeRequired"
              value={formData.timeRequired}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select duration" },
                { value: "15", label: "Ride Duration" },
                { value: "1h", label: "1 Hours" },
                { value: "2h", label: "2 Hours" },
                { value: "custom", label: "Custom" },
              ]}
              required={formData.rideTimeWindow === "custom"}
            />
          </div>

          <div>{/* left to add */}</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            variant="dark"
            size="lg"
            fullWidth
            rounded="lg"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Find Driver"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            rounded="lg"
            onClick={() => onSearch({ ...formData, autoAssign: true })}
          >
            Auto Assign Driver
          </Button>
        </div>
      </form>
    </div>
  );
};
