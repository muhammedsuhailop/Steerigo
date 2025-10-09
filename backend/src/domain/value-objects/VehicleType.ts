export enum GearType {
  MANUAL = "Manual",
  AUTOMATIC = "Automatic",
}

export enum BodyType {
  SEDAN = "Sedan",
  SUV = "SUV",
  HATCHBACK = "Hatchback",
}

export const VALID_GEAR_TYPES = Object.values(GearType);
export const VALID_BODY_TYPES = Object.values(BodyType);
