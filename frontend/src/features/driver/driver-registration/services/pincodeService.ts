import { PincodeDetails } from "../types";
import { EXTERNAL_API } from "@/shared/constants/api";

export const getPincodeDetails = async (
  pincode: string
): Promise<
  { success: true; data: PincodeDetails } | { success: false; error: string }
> => {
  try {
    const resp = await fetch(`${EXTERNAL_API.POSTAL}/${pincode}`);
    const json = await resp.json();
    const result = json[0];
    if (result?.Status === "Success" && result.PostOffice?.length) {
      const po = result.PostOffice[0];
      return {
        success: true,
        data: {
          state: po.State,
          district: po.District,
          postOffice: po.Name,
        },
      };
    }
    return { success: false, error: "Invalid PIN code" };
  } catch {
    return { success: false, error: "Network error" };
  }
};
