import {
  DriverRegistrationData,
  ValidationResult,
  RegistrationStep,
} from "../types/driverRegistration.types";
import {
  VALID_LICENSE_CATEGORIES,
  VALID_GEAR_TYPES,
  VALID_BODY_TYPES,
  VALID_DOC_TYPES,
  LicenseCategory,
  GearType,
  BodyType,
  DocumentType,
} from "../constants/valueObjects";

class DriverValidationService {
  validatePersonalInfo(
    data: Partial<DriverRegistrationData>
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name?.trim()) {
      errors.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (data.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    }

    // Mobile validation
    if (!data.mobile?.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\+?\d{10,15}$/.test(data.mobile.trim())) {
      errors.mobile = "Invalid mobile number format";
    }

    // DOB validation
    if (!data.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const date = new Date(data.dob);
      const cutoff = new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000);
      if (isNaN(date.getTime())) {
        errors.dob = "Invalid date format";
      } else if (date > cutoff) {
        errors.dob = "Driver must be at least 18 years old";
      }
    }

    // Gender validation
    if (!["Male", "Female", "Other"].includes(data.gender || "")) {
      errors.gender = "Gender is required";
    }

    // State validation
    if (!data.state?.trim()) {
      errors.state = "State is required";
    }

    // PIN validation
    if (!data.pin?.trim()) {
      errors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(data.pin.trim())) {
      errors.pin = "PIN code must be 6 digits";
    }

    // Address validation
    if (!data.address?.trim()) {
      errors.address = "Address is required";
    } else if (data.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    } else if (data.address.trim().length > 500) {
      errors.address = "Address must be less than 500 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateLicenseInfo(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    // License Category validation
    if (!data.licenseCategory) {
      errors.licenseCategory = "License category is required";
    } else if (
      !VALID_LICENSE_CATEGORIES.includes(
        data.licenseCategory as LicenseCategory
      )
    ) {
      errors.licenseCategory = "Invalid license category";
    }

    // License Number validation
    if (!data.licenseNumber?.trim()) {
      errors.licenseNumber = "License number is required";
    } else if (data.licenseNumber.trim().length < 5) {
      errors.licenseNumber = "License number must be at least 5 characters";
    } else if (data.licenseNumber.trim().length > 20) {
      errors.licenseNumber = "License number must not exceed 20 characters";
    }

    // License Body Types validation
    if (
      !Array.isArray(data.licenseBodyTypes) ||
      !data.licenseBodyTypes.length
    ) {
      errors.licenseBodyTypes = "At least one body type must be selected";
    } else if (
      !data.licenseBodyTypes.every((type) =>
        VALID_BODY_TYPES.includes(type as BodyType)
      )
    ) {
      errors.licenseBodyTypes = "Invalid body type selected";
    }

    // License Gear Types validation
    if (
      !Array.isArray(data.licenseGearTypes) ||
      !data.licenseGearTypes.length
    ) {
      errors.licenseGearTypes = "At least one gear type must be selected";
    } else if (
      !data.licenseGearTypes.every((type) =>
        VALID_GEAR_TYPES.includes(type as GearType)
      )
    ) {
      errors.licenseGearTypes = "Invalid gear type selected";
    }

    // License Issue Date validation
    if (!data.licenseIssueDate) {
      errors.licenseIssueDate = "License issue date is required";
    } else {
      const issue = new Date(data.licenseIssueDate);
      if (isNaN(issue.getTime())) {
        errors.licenseIssueDate = "Invalid issue date";
      } else if (issue > new Date()) {
        errors.licenseIssueDate = "License issue date cannot be in the future";
      }
    }

    // License Expiry Date validation
    if (!data.licenseExpiryDate) {
      errors.licenseExpiryDate = "License expiry date is required";
    } else {
      const expiry = new Date(data.licenseExpiryDate);
      if (isNaN(expiry.getTime())) {
        errors.licenseExpiryDate = "Invalid expiry date";
      } else if (expiry <= new Date()) {
        errors.licenseExpiryDate = "License expiry date must be in the future";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateIdInfo(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    // ID Type validation
    if (!data.idType) {
      errors.idType = "ID type is required";
    } else if (!VALID_DOC_TYPES.includes(data.idType as DocumentType)) {
      errors.idType = "Invalid ID type";
    }

    // ID Number validation
    if (!data.idNumber?.trim()) {
      errors.idNumber = "ID number is required";
    } else if (data.idNumber.trim().length < 5) {
      errors.idNumber = "ID number must be at least 5 characters";
    } else if (data.idNumber.trim().length > 50) {
      errors.idNumber = "ID number must not exceed 50 characters";
    }

    // ID Issue Date validation
    if (!data.idIssueDate) {
      errors.idIssueDate = "ID issue date is required";
    } else {
      const issue = new Date(data.idIssueDate);
      if (isNaN(issue.getTime())) {
        errors.idIssueDate = "Invalid issue date";
      } else if (issue > new Date()) {
        errors.idIssueDate = "ID issue date cannot be in the future";
      }
    }

    // ID Expiry Date validation
    if (data.idExpiryDate) {
      const expiry = new Date(data.idExpiryDate);
      if (isNaN(expiry.getTime())) {
        errors.idExpiryDate = "Invalid expiry date";
      } else if (expiry <= new Date()) {
        errors.idExpiryDate = "ID expiry date must be in the future";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateDocuments(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    // Document validation
    if (!data.licenseFrontImage) {
      errors.licenseFrontImage = "License front image is required";
    }

    if (!data.licenseBackImage) {
      errors.licenseBackImage = "License back image is required";
    }

    if (!data.idFrontImage) {
      errors.idFrontImage = "ID front image is required";
    }

    if (!data.idBackImage) {
      errors.idBackImage = "ID back image is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateStep(
    step: RegistrationStep,
    data: Partial<DriverRegistrationData>
  ): ValidationResult {
    switch (step) {
      case RegistrationStep.PERSONAL_INFO:
        return this.validatePersonalInfo(data);
      case RegistrationStep.LICENSE_INFO:
        return this.validateLicenseInfo(data);
      case RegistrationStep.ID_INFO:
        return this.validateIdInfo(data);
      case RegistrationStep.DOCUMENTS:
        return this.validateDocuments(data);
      default:
        return { isValid: true, errors: {} };
    }
  }

  validateAll(data: DriverRegistrationData): ValidationResult {
    const allErrors: Record<string, string> = {};

    const personalValidation = this.validatePersonalInfo(data);
    const licenseValidation = this.validateLicenseInfo(data);
    const idValidation = this.validateIdInfo(data);
    const documentsValidation = this.validateDocuments(data);

    Object.assign(allErrors, personalValidation.errors);
    Object.assign(allErrors, licenseValidation.errors);
    Object.assign(allErrors, idValidation.errors);
    Object.assign(allErrors, documentsValidation.errors);

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors,
    };
  }
}

export const driverValidationService = new DriverValidationService();
