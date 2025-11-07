import React from "react";
import { Card } from "@/shared/components/ui/Card";

export const EligibilitySection: React.FC<{
  gearTypes: string[];
  bodyTypes: string[];
}> = ({ gearTypes, bodyTypes }) => {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        {/* Header  */}
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Preferred Vehicles and Transmissions
        </h3>

        <div className="space-y-6">
          {/* Gear Types */}
          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Eligible Gear Types
            </p>

            <div className="flex flex-wrap gap-2">
              {gearTypes && gearTypes.length > 0 ? (
                gearTypes.map((gear) => (
                  <span
                    key={gear}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {gear}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No gear types specified</p>
              )}
            </div>
          </div>

          {/* Body Types */}
          <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Eligible Body Types
            </p>

            <div className="flex flex-wrap gap-2">
              {bodyTypes && bodyTypes.length > 0 ? (
                bodyTypes.map((body) => (
                  <span
                    key={body}
                    className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {body}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No body types specified</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
