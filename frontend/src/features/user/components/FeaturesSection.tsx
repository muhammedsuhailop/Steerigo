import React from "react";
import FeatureCard from "./FeatureCard";
import { FaCouch, FaPiggyBank } from "react-icons/fa";
import { GrLocationPin } from "react-icons/gr";

const features = [
  {
    icon: GrLocationPin,
    title: "Availability",
    description:
      "Always ready—SteeriGo connects you with trusted drivers anytime.",
  },
  {
    icon: FaCouch,
    title: "Comfort",
    description: "Enjoy reliable rides with friendly, professional drivers.",
  },
  {
    icon: FaPiggyBank,
    title: "Savings",
    description:
      "Transparent fares and smart choices mean better savings for you.",
  },
];

const FeaturesSection: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="container w-[95%] mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((f) => (
        <FeatureCard
          key={f.title}
          icon={f.icon}
          title={f.title}
          description={f.description}
        />
      ))}
    </div>
  </section>
);

export default FeaturesSection;
