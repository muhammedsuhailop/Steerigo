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
export declare class FileListRequestDto {
    private readonly userId?;
    private readonly purpose?;
    private readonly page;
    private readonly pageSize;
    private readonly search?;
    private readonly dateFrom?;
    private readonly dateTo?;
    constructor(query: unknown);
    getUserId(): string | undefined;
    getPurpose(): FilePurpose | undefined;
    getPage(): number;
    getPageSize(): number;
    getSearch(): string | undefined;
    getDateFrom(): Date | undefined;
    getDateTo(): Date | undefined;
    validate(): string[];
}
//# sourceMappingURL=FileListRequestDto.d.ts.map