import React from "react";
import StatsCard from "./StatsCard";
import banner from "@/assets/images/HP_banner1.png";

const stats = [
  { value: "540+", label: "Drivers", iconName: "car" },
  { value: "20k+", label: "Customers", iconName: "users" },
  { value: "2500+", label: "Rides", iconName: "steering" },
  { value: "20m+", label: "Miles", iconName: "speedometer" },
];

const StatsSection: React.FC = () => (
  <section
    className="relative w-[95%] mx-auto p-4 sm:p-6 lg:p-10 rounded-3xl overflow-hidden"
    style={{
      backgroundImage: `url(${banner})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay (now visible) */}
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

    <div className="relative z-10 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        SteeriGo At A Glance
      </h2>
      <p className="max-w-xl mx-auto mb-10 text-gray-700">
        Every ride on SteeriGo is built on reliability, trust, and seamless
        service. Join a growing community where your journey always comes
        first—where finding the right driver is just...
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ value, label }, idx) => (
          <StatsCard key={idx} value={value} label={label} />
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
