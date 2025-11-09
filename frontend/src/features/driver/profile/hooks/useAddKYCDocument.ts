import { useState, useCallback } from "react";
import { useAddKYCDocumentMutation } from "../services/driverProfileApi";
import { AddKYCResult, KYCPayload } from "../types/driverProfile.types";

export const useAddKYCDocument = () => {
  const [addKYCMutation] = useAddKYCDocumentMutation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addDocument = useCallback(
    async (payload: KYCPayload): Promise<AddKYCResult> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await addKYCMutation(payload).unwrap();

        return {
          success: true,
        };
      } catch (err: any) {
        const errorMessage =
          err?.data?.message || err?.message || "Failed to submit KYC document";

        console.error("KYC submission error:", errorMessage);
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [addKYCMutation]
  );

  return {
    addDocument,
    isLoading,
    error,
  };
};
