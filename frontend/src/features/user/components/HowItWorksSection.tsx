import React from "react";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlayCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import mapImage from "@/assets/images/map car.png";

const steps = [
  {
    icon: FaMapMarkerAlt,
    title: "Set Pickup & Select Ride",
    description:
      "Choose your location, vehicle type, and ride option (instant/scheduled).",
  },
  {
    icon: FaCheckCircle,
    title: "Find & Confirm Driver",
    description:
      "Browse/filter drivers, request a ride, and wait for driver acceptance.",
  },
  {
    icon: FaPlayCircle,
    title: "Verify & Start Ride",
    description:
      "Share the unique start code with your driver to securely begin the trip.",
  },
  {
    icon: FaClipboardCheck,
    title: "Complete & Confirm Ride",
    description:
      "Enter the end code from the driver to finish and rate your ride.",
  },
];

const HowItWorksSection: React.FC = () => (
  <section className="py-16 bg-white">
    <div className="container w-[95%] mx-auto p-4 sm:p-6 lg:p-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
        How to Get Your Driver Quickly
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="flex justify-center lg:justify-start">
          <img
            src={mapImage}
            alt="How it works map"
            className="w-[90%] max-w-md rounded-2xl shadow-lg p-4 m-4"
          />
        </div>
        {/* Right */}
        <div className="space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Icon className="text-black-600" />
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
