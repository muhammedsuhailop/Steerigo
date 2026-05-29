import React from "react";
import {
  RiArrowRightLine,
  RiCalendarScheduleLine,
  RiCheckboxCircleFill,
  RiMapPin2Fill,
  RiRoadMapLine,
  RiSearchEyeLine,
  RiShieldCheckLine,
  RiStarSmileLine,
  RiTimeLine,
  RiTimerFlashLine,
  RiUserLocationLine,
} from "react-icons/ri";

import Card from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { useNavigate } from "react-router-dom";
interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface FeatureItem {
  title: string;
  description: string;
}

const quickRequestSteps: StepItem[] = [
  {
    step: "01",
    title: "Enter Ride Details",
    description:
      "Choose ride type, pickup location, drop location and required duration.",
    icon: RiRoadMapLine,
  },
  {
    step: "02",
    title: "Find Nearby Drivers",
    description:
      "SteeriGo searches for nearby top-rated available drivers instantly.",
    icon: RiSearchEyeLine,
  },
  {
    step: "03",
    title: "Driver Matching",
    description: "Your request is sent to the best matching nearby driver.",
    icon: RiUserLocationLine,
  },
  {
    step: "04",
    title: "Start Your Ride",
    description:
      "Track the driver, verify your trip and begin your journey safely.",
    icon: RiShieldCheckLine,
  },
];

const scheduleSteps: StepItem[] = [
  {
    step: "01",
    title: "Select Future Date & Time",
    description:
      "Book rides at least 6 hours in advance with proper scheduling.",
    icon: RiCalendarScheduleLine,
  },
  {
    step: "02",
    title: "Add Ride Preferences",
    description:
      "Select pickup, drop-off, duration, body type and gear preferences.",
    icon: RiMapPin2Fill,
  },
  {
    step: "03",
    title: "Driver Request Processing",
    description: "Nearby eligible drivers receive your future ride request.",
    icon: RiTimerFlashLine,
  },
  {
    step: "04",
    title: "Get Confirmation",
    description:
      "Within 10 minutes you receive acceptance or unavailable status.",
    icon: RiCheckboxCircleFill,
  },
];

const features: FeatureItem[] = [
  {
    title: "Nearest Driver Matching",
    description:
      "Finds the nearest available driver for faster ride confirmations.",
  },
  {
    title: "Top Rated Drivers",
    description: "Prioritizes trusted and highly rated professional drivers.",
  },
  {
    title: "Flexible Ride Duration",
    description:
      "Choose custom ride durations based on your exact requirement.",
  },
  {
    title: "Advance Ride Booking",
    description:
      "Schedule rides ahead of time for stress-free travel planning.",
  },
];

const HowItWorksSection: React.FC = () => {
  const navigate = useNavigate();

  const [loadingRoute, setLoadingRoute] = React.useState<
    "quick" | "schedule" | null
  >(null);

  const handleNavigate = (type: "quick" | "schedule", path: string) => {
    setLoadingRoute(type);

    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[40px] bg-white border border-gray-200 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_35%),radial-gradient(circle_at_bottom_left,#e2e8f0,transparent_30%)]" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <RiStarSmileLine className="w-4 h-4" />
                Smart Driver Booking Platform
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Book Drivers
                <span className="block text-blue-600 mt-2">
                  Quickly & Reliably
                </span>
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
                SteeriGo helps users instantly find nearby professional drivers
                or schedule rides in advance with a smooth and secure booking
                experience.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={loadingRoute !== null}
                  onClick={() => handleNavigate("quick", "/search")}
                >
                  <div className="flex items-center gap-2">
                    <span>Quick Driver Request</span>

                    {loadingRoute === "quick" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <RiArrowRightLine className="w-5 h-5" />
                    )}
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  disabled={loadingRoute !== null}
                  onClick={() => handleNavigate("schedule", "/search/schedule")}
                >
                  <div className="flex items-center gap-2">
                    <span>Schedule Future Ride</span>

                    {loadingRoute === "schedule" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <RiArrowRightLine className="w-5 h-5" />
                    )}
                  </div>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  "Nearby Drivers",
                  "Future Booking",
                  "Safe Travel",
                  "Fast Matching",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-center shadow-sm"
                  >
                    <p className="text-sm font-medium text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <Card className="rounded-[32px] overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gray-900 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Quick Driver Match</p>

                    <h3 className="text-3xl font-bold mt-2">Driver Found</h3>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <RiUserLocationLine className="w-8 h-8" />
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400" />

                      <div>
                        <p className="text-xs text-gray-300">Pickup</p>

                        <p className="font-medium">Kozhikode Railway Station</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />

                      <div>
                        <p className="text-xs text-gray-300">Drop</p>

                        <p className="font-medium">
                          Calicut International Airport
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs text-gray-300">Duration</p>

                    <p className="text-lg font-semibold mt-1">4 Hours</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-xs text-gray-300">Driver Rating</p>

                    <p className="text-lg font-semibold mt-1">4.9 ★</p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-500 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100">Average Match Time</p>

                    <h4 className="text-xl font-bold">Under 2 Minutes</h4>
                  </div>

                  <RiTimeLine className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Request */}
        <div className="mt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <RiTimerFlashLine className="w-4 h-4" />
              Quick Driver Request
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Find a Driver Instantly
            </h2>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Need a driver immediately? SteeriGo quickly connects you with the
              nearest available top-rated drivers based on your ride details.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickRequestSteps.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.step}
                  className="group rounded-3xl p-7 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-gray-900 transition-all duration-300 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    </div>

                    <span className="text-4xl font-bold text-gray-100">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mt-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                <RiCalendarScheduleLine className="w-4 h-4" />
                Schedule Future Ride
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Book Drivers in Advance
              </h2>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Schedule future rides by selecting date and time at least 6
                hours ahead. Drivers receive your request and respond within 10
                minutes.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Minimum booking is 6 hours ahead",
                  "Choose duration and ride preferences",
                  "Drivers receive booking requests instantly",
                  "Get confirmation within 10 minutes",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <RiCheckboxCircleFill className="w-4 h-4 text-green-600" />
                    </div>

                    <p className="text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <Card className="rounded-[32px] p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Future Ride Booking</p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    Booking Flow
                  </h3>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <RiCalendarScheduleLine className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="mt-10 space-y-8">
                {scheduleSteps.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.step} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>

                        {index !== scheduleSteps.length - 1 && (
                          <div className="w-[2px] h-14 bg-gray-200 mt-3" />
                        )}
                      </div>

                      <div className="pb-6">
                        <span className="text-sm font-bold text-blue-600">
                          STEP {item.step}
                        </span>

                        <h4 className="text-lg font-semibold text-gray-900 mt-1">
                          {item.title}
                        </h4>

                        <p className="mt-2 text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose SteeriGo?
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              A smarter and more reliable way to find professional drivers.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <RiStarSmileLine className="w-7 h-7 text-gray-800" />
                </div>

                <h3 className="mt-7 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24">
          <div className="relative overflow-hidden rounded-[40px] bg-gray-900 px-8 py-16 sm:px-14 text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#60a5fa,transparent_25%),radial-gradient(circle_at_bottom_left,#2563eb,transparent_25%)]" />

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-bold text-white">
                Ready to Book Your Driver?
              </h2>

              <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Start a quick driver request or schedule your next ride in
                advance with SteeriGo.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={loadingRoute !== null}
                  onClick={() => handleNavigate("quick", "/search")}
                >
                  <div className="flex items-center gap-2">
                    <span>Start Quick Request</span>

                    {loadingRoute === "quick" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <RiArrowRightLine className="w-5 h-5" />
                    )}
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  disabled={loadingRoute !== null}
                  onClick={() => handleNavigate("schedule", "/search/schedule")}
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <span>Schedule Future Ride</span>

                    {loadingRoute === "schedule" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                      <RiArrowRightLine className="w-5 h-5" />
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
