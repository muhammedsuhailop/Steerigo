import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

export type SearchModalState = "SEARCHING" | "SUCCESS" | "NO_DRIVER" | null;

const SEARCH_MESSAGES = [
  "Finding you a great ride...",
  "Checking in with drivers nearby...",
  "Hang tight, we're on the lookout!",
  "Matching you with a top-rated driver...",
  "Just a moment longer, nearly there...",
  "Checking one more time for a closer match...",
];

interface SearchStatusModalProps {
  state: SearchModalState;
  message?: string;
  onCancel?: () => void;
  onClose?: () => void;
}

const SearchStatusModal: React.FC<SearchStatusModalProps> = ({
  state,
  message,
  onCancel,
  onClose,
}) => {
  if (!state) return null;

  const [dynamicMessage, setDynamicMessage] = useState<string>("");

  useEffect(() => {
    if (state !== "SEARCHING") return;

    let index = 0;

    setDynamicMessage(SEARCH_MESSAGES[0]);

    const interval = setInterval(() => {
      index = (index + 1) % SEARCH_MESSAGES.length;
      setDynamicMessage(SEARCH_MESSAGES[index]);
    }, 5500);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 px-6 py-6 bg-white rounded-2xl shadow-xl text-center relative">
        {onClose && state !== "SEARCHING" && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        )}

        {state === "SEARCHING" && (
          <>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-transparent animate-wave" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 flex justify-center items-center gap-1">
              {message || "Searching"}
              <span className="flex">
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:150ms]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:300ms]">
                  .
                </span>
              </span>
            </h3>

            <p className="text-sm text-gray-500 mt-2 transition-opacity duration-300">
              {dynamicMessage}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-ping" />
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-ping [animation-delay:200ms]" />
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-ping [animation-delay:400ms]" />
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="mt-6 text-sm font-medium text-rose-600 hover:underline"
              >
                Cancel Request
              </button>
            )}
          </>
        )}

        {state === "NO_DRIVER" && (
          <>
            <MdErrorOutline className="text-red-500 text-4xl mx-auto mb-3" />

            <h3 className="text-lg font-semibold text-gray-900">
              No Drivers Available
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Please try again in a moment
            </p>
          </>
        )}

        {state === "SUCCESS" && (
          <>
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />

            <h3 className="text-lg font-semibold text-gray-900">
              Driver Accepted
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Redirecting to your ride...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchStatusModal;
