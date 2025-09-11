import React from "react";
import { IconType } from "react-icons";

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-lg shadow text-center">
    <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
      <Icon className="text-2xl text-blue-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeatureCard;
