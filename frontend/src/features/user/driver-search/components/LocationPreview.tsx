import { Location } from "@/shared/types/ride.types";
import { FaEdit, FaTimes, FaCircle, FaSquareFull } from "react-icons/fa";

const LocationPreview: React.FC<{
  label: string;
  location: Location | null;
  onEdit: () => void;
  onClear: () => void;
}> = ({ label, location, onEdit, onClear }) => {
  const isPickup = label === "Pickup";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-1 shrink-0">
          {isPickup ? (
            <FaCircle className="text-green-500 text-[10px]" />
          ) : (
            <FaSquareFull className="text-red-500 text-[10px]" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {location?.address || "Selected location"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
          title="Change location"
        >
          <FaEdit className="text-xs" />
        </button>

        <button
          type="button"
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-rose-500 transition"
          title="Clear location"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default LocationPreview;
