import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Alert } from "@/shared/components/ui/Alert";
import { FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";
import { useDriverProfile } from "../hooks/useDriverProfile";

interface EligibilitySectionProps {
  gearTypes: string[];
  bodyTypes: string[];
  onUpdate?: () => void;
}

const GEAR_TYPE_OPTIONS = ["Manual", "Automatic"];
const BODY_TYPE_OPTIONS = ["Sedan", "SUV", "Hatchback"];

export const EligibilitySection: React.FC<EligibilitySectionProps> = ({
  gearTypes,
  bodyTypes,
  onUpdate,
}) => {
  const { updateProfile, isUpdating, error, success } = useDriverProfile();

  const [editMode, setEditMode] = useState(false);
  const [selectedGearTypes, setSelectedGearTypes] = useState<string[]>(
    gearTypes || []
  );
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(
    bodyTypes || []
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  useEffect(() => {
    setSelectedGearTypes(gearTypes || []);
    setSelectedBodyTypes(bodyTypes || []);
  }, [gearTypes, bodyTypes, editMode]);

  useEffect(() => {
    if (success) {
      setLocalSuccess(success);
      const timer = setTimeout(() => setLocalSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => setLocalError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleGearTypeToggle = (type: string) => {
    setSelectedGearTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleBodyTypeToggle = (type: string) => {
    setSelectedBodyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    if (selectedGearTypes.length === 0 && selectedBodyTypes.length === 0) {
      setLocalError("Please select at least one gear type or body type");
      return;
    }

    try {
      setLocalError(null);
      const result = await updateProfile({
        eligibleGearTypes: selectedGearTypes,
        eligibleBodyTypes: selectedBodyTypes,
      });

      if (result.success) {
        setEditMode(false);
        if (onUpdate) onUpdate();
      }
    } catch {
      setLocalError("Failed to update eligibility");
    }
  };

  const handleCancel = () => {
    setSelectedGearTypes(gearTypes || []);
    setSelectedBodyTypes(bodyTypes || []);
    setEditMode(false);
  };

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Preferred Vehicles & Transmissions
            </h3>
            {editMode && (
              <p className="text-xs text-gray-500 mt-1">
                Select your preferred vehicle types and transmissions
              </p>
            )}
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <FaPencilAlt className="text-gray-600" size={16} />
            </button>
          )}
        </div>

        {/* Alerts */}
        {localError && (
          <div className="mb-4">
            <Alert
              type="danger"
              message={localError}
              onClose={() => setLocalError(null)}
            />
          </div>
        )}

        {localSuccess && (
          <div className="mb-4">
            <Alert
              type="success"
              message={localSuccess}
              onClose={() => setLocalSuccess(null)}
            />
          </div>
        )}

        {editMode ? (
          // Edit Mode
          <div className="space-y-6">
            {/* Gear Types */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Gear Types
              </p>
              <div className="space-y-2">
                {GEAR_TYPE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGearTypes.includes(option)}
                      onChange={() => handleGearTypeToggle(option)}
                      disabled={isUpdating}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Body Types */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Body Types
              </p>
              <div className="space-y-2">
                {BODY_TYPE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBodyTypes.includes(option)}
                      onChange={() => handleBodyTypeToggle(option)}
                      disabled={isUpdating}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <FaTimes size={16} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <FaSave size={16} />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Gear Types
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGearTypes && selectedGearTypes.length > 0 ? (
                  selectedGearTypes.map((gear) => (
                    <Badge
                      key={gear}
                      variant="info"
                      size="md"
                      className="text-sm"
                    >
                      {gear}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No gear types specified
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Body Types
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedBodyTypes && selectedBodyTypes.length > 0 ? (
                  selectedBodyTypes.map((body) => (
                    <Badge
                      key={body}
                      variant="success"
                      size="md"
                      className="text-sm"
                    >
                      {body}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No body types specified
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
