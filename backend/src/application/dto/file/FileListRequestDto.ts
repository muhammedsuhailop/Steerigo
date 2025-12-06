import { FilePurpose } from "@domain/value-objects/FilePurpose";

export interface FileListQuery {
  userId?: string;
  purpose?: string;
  page?: string;
  pageSize?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class FileListRequestDto {
  private readonly userId?: string;
  private readonly purpose?: string;
  private readonly page: number;
  private readonly pageSize: number;
  private readonly search?: string;
  private readonly dateFrom?: string;
  private readonly dateTo?: string;

  constructor(query: unknown) {
    const input = (query ?? {}) as FileListQuery;

    this.userId = typeof input.userId === "string" ? input.userId : undefined;
    this.purpose =
      typeof input.purpose === "string" ? input.purpose : undefined;

    const parsePositiveInt = (v: string | undefined, fallback: number) => {
      if (!v) return fallback;
      const n = Number.parseInt(v, 10);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };

    this.page = Math.max(1, parsePositiveInt(input.page, 1));
    this.pageSize = Math.min(
      50,
      Math.max(1, parsePositiveInt(input.pageSize, 10))
    );

    this.search = typeof input.search === "string" ? input.search : undefined;
    this.dateFrom =
      typeof input.dateFrom === "string" ? input.dateFrom : undefined;
    this.dateTo = typeof input.dateTo === "string" ? input.dateTo : undefined;
  }

  getUserId(): string | undefined {
    return this.userId;
  }

  getPurpose(): FilePurpose | undefined {
    return this.purpose ? FilePurpose.create(this.purpose) : undefined;
  }

  getPage(): number {
    return this.page;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getSearch(): string | undefined {
    return this.search;
  }

  getDateFrom(): Date | undefined {
    return this.dateFrom ? new Date(this.dateFrom) : undefined;
  }

  getDateTo(): Date | undefined {
    return this.dateTo ? new Date(this.dateTo) : undefined;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.purpose) {
      try {
        FilePurpose.create(this.purpose);
      } catch (error) {
        errors.push((error as Error).message);
      }
    }

    const dateFrom = this.getDateFrom();
    const dateTo = this.getDateTo();

    if (dateFrom && isNaN(dateFrom.getTime())) {
      errors.push("Invalid dateFrom format");
    }

    if (dateTo && isNaN(dateTo.getTime())) {
      errors.push("Invalid dateTo format");
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      errors.push("dateFrom cannot be after dateTo");
    }

    return errors;
  }
}
