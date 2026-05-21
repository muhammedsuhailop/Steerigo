import { FaLocationArrow, FaMapMarkerAlt } from "react-icons/fa";
import LeafletMarker from "./LeafletMarker";

interface CurrentLocationManagerProps {
  currentLocation?: any;
  selectedLocation?: any;
  isLocationSaving: boolean;
  onLocationSelect: (location: any) => void;
  onSaveLocation: () => void;
}

const CurrentLocationManager = ({
  currentLocation,
  selectedLocation,
  isLocationSaving,
  onLocationSelect,
  onSaveLocation,
}: CurrentLocationManagerProps) => {
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      {/* Map Section */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-indigo-500" />
            Current Location
          </h3>

          <p className="text-sm text-slate-500">
            Update your current location to receive nearby ride requests faster.
          </p>
        </div>
        <LeafletMarker
          onLocationSelect={onLocationSelect}
          initialLocation={currentLocation || selectedLocation || undefined}
        />

        {/* Save Location Button */}
        <div className="mt-5">
          <button
            onClick={onSaveLocation}
            disabled={!selectedLocation || isLocationSaving}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
              !selectedLocation || isLocationSaving
                ? "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300"
                : "bg-slate-700 text-white hover:bg-slate-800 border border-slate-600 shadow-sm"
            }`}
          >
            <FaLocationArrow size={18} />
            {isLocationSaving ? "Saving..." : "Update Current Location"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentLocationManager;
