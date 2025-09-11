import React from "react";
import { FaUsers, FaTachometerAlt, FaRoad } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";

interface StatsCardProps {
  value: string;
  label: string;
}

const icons = {
  Drivers: <GiSteeringWheel className="text-white w-6 h-6" />,
  Customers: <FaUsers className="text-white w-6 h-6" />,
  Rides: <FaTachometerAlt className="text-white w-6 h-6" />,
  Miles: <FaRoad className="text-white w-6 h-6" />,
};

const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => (
  <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow-md">
    <div className="bg-black w-12 h-12 rounded-lg flex items-center justify-center">
      {icons[label]}
    </div>
    <div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-gray-700 font-medium">{label}</div>
    </div>
  </div>
);

export default StatsCard;
