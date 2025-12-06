import { Types } from "mongoose";

// Convert a value (string | Types.ObjectId) to a mongoose ObjectId.

export function toObjectId(value: unknown): Types.ObjectId {
  if (value instanceof Types.ObjectId) return value;

  if (typeof value === "string") {
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      return new Types.ObjectId(value);
    }
    return new Types.ObjectId(value);
  }

  throw new TypeError("Invalid id: expected string or Types.ObjectId");
}

// Convert value to Types.ObjectId or return null for null/undefined.
export function toObjectIdOrNull(value: unknown): Types.ObjectId | null {
  if (value == null) return null;
  try {
    return toObjectId(value);
  } catch {
    return null;
  }
}

// Convert persistence id (Types.ObjectId | string) to domain string id.
export function toStringId(value: unknown): string {
  if (value instanceof Types.ObjectId) return value.toHexString();
  if (typeof value === "string") return value;
  throw new TypeError("Invalid id: expected Types.ObjectId or string");
}
