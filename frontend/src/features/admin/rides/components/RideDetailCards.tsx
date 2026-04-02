import React from "react";

export const StatusBadge: React.FC<{
  status: string;
  type?: "ride" | "payment";
}> = ({ status, type = "ride" }) => {
  const getColors = () => {
    const s = status.toUpperCase();
    if (["COMPLETED", "SUCCESS", "PAID"].includes(s))
      return "bg-green-100 text-green-700 border-green-200";
    if (["CANCELLED", "FAILED", "REJECTED"].includes(s))
      return "bg-red-100 text-red-700 border-red-200";
    if (["STARTED", "ARRIVED", "ONGOING"].includes(s))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${getColors()}`}
    >
      {status}
    </span>
  );
};

export const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
}> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
    <span className="text-blue-600 text-xl">{icon}</span>
    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
      {title}
    </h3>
  </div>
);

export const DataItem: React.FC<{
  label: string;
  value: React.ReactNode;
  subValue?: string;
}> = ({ label, value, subValue }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
      {label}
    </span>
    <div className="text-sm font-semibold text-gray-900">{value}</div>
    {subValue && (
      <div className="text-[10px] text-gray-500 font-medium">{subValue}</div>
    )}
  </div>
);
