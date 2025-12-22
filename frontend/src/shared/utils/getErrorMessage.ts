export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    if (
      "data" in error &&
      typeof (error as { data?: { message?: string } }).data?.message ===
        "string"
    ) {
      return (error as { data: { message: string } }).data.message;
    }

    if (
      "message" in error &&
      typeof (error as { message?: string }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }
  return fallback;
};
