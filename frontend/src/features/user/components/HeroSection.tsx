import React from "react";
import HPBanner from "@/assets/images/HP_banner1.png";
import { Button } from "@/components";

const HeroSection: React.FC = () => (
  <section className="relative m-4 sm:m-6">
    <div
      className="w-[95%] mx-auto p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row items-center
             rounded-3xl bg-cover bg-center shadow-lg relative overflow-hidden"
      style={{ backgroundImage: `url(${HPBanner})` }}
    >
      {/* dark overlay*/}
      <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

      {/* (Text content) */}
      <div className="relative z-10 lg:w-2/3 text-center lg:text-left">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Driving Dreams, Riding Easy
        </h1>
        <p className="text-gray-200 text-base sm:text-lg mb-6 max-w-xl mx-auto lg:mx-0">
          Find safe, fast rides anywhere. SteeriGo connects riders and drivers
          for a seamless journey.
        </p>
        <Button variant="primary" size="md">
          Find Driver Now
        </Button>
      </div>

      {/* Form */}
      <div className="relative z-10 lg:w-1/3 w-full max-w-md mt-10 lg:mt-0 lg:ml-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Find your driver</h2>
          <form className="space-y-4">
            <div>
              <select className="w-full border rounded px-3 py-2">
                <option>Car type</option>
              </select>
            </div>
            <div>
              <select className="w-full border rounded px-3 py-2">
                <option>Gear Type</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Pickup Location"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Drop Location"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <select className="w-full border rounded px-3 py-2">
                <option>Now - In 15 minutes</option>
              </select>
            </div>
            <div>
              <select className="w-full border rounded px-3 py-2">
                <option>Ride Duration</option>
              </select>
            </div>
            <Button type="submit" variant="primary" size="md" fullWidth>
              Find Driver Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
