// import { File } from "@domain/entities/File";
// import { FilePurpose } from "@domain/value-objects/FilePurpose";

// export interface FileFilters {
//   userId?: string;
//   purpose?: FilePurpose;
//   isActive?: boolean;
//   dateFrom?: Date;
//   dateTo?: Date;
//   mimeType?: string;
//   search?: string;
// }

// export interface PaginationOptions {
//   page: number;
//   pageSize: number;
// }

// export interface PaginatedResult<T> {
//   data: T[];
//   pagination: {
//     page: number;
//     pageSize: number;
//     totalPages: number;
//     totalItems: number;
//   };
// }

// export interface FileRepository {
//   save(file: File): Promise<File>;
//   findById(id: string): Promise<File | null>;
//   findByUserId(userId: string): Promise<File[]>;
//   findByUserIdAndPurpose(userId: string, purpose: FilePurpose): Promise<File[]>;
//   findWithFilters(
//     filters: FileFilters,
//     pagination: PaginationOptions
//   ): Promise<PaginatedResult<File>>;
//   update(id: string, updates: Partial<File>): Promise<File | null>;
//   delete(id: string): Promise<boolean>;
//   markAsInactive(id: string): Promise<boolean>;
// }
