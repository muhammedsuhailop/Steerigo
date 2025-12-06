export class KycDocumentsDto {
  readonly license?: string;
  readonly id?: string;

  constructor(license?: string, id?: string) {
    this.license = license;
    this.id = id;
  }
}

export class SubmitKYCResponseDto {
  readonly message: string;
  readonly kycDocuments: { [key: string]: string };
  readonly licenseUpdated: boolean;
  readonly idUpdated: boolean;
  readonly driverUpdated: boolean;

  constructor(
    message: string,
    kycDocuments: { [key: string]: string },
    licenseUpdated: boolean,
    idUpdated: boolean,
    driverUpdated: boolean
  ) {
    this.message = message;
    this.kycDocuments = kycDocuments;
    this.licenseUpdated = licenseUpdated;
    this.idUpdated = idUpdated;
    this.driverUpdated = driverUpdated;
  }
}
