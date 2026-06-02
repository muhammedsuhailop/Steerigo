"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileListRequestDto = void 0;
const FilePurpose_1 = require("@domain/value-objects/FilePurpose");
class FileListRequestDto {
    constructor(query) {
        const input = (query ?? {});
        this.userId = typeof input.userId === "string" ? input.userId : undefined;
        this.purpose =
            typeof input.purpose === "string" ? input.purpose : undefined;
        const parsePositiveInt = (v, fallback) => {
            if (!v)
                return fallback;
            const n = Number.parseInt(v, 10);
            return Number.isFinite(n) && n > 0 ? n : fallback;
        };
        this.page = Math.max(1, parsePositiveInt(input.page, 1));
        this.pageSize = Math.min(50, Math.max(1, parsePositiveInt(input.pageSize, 10)));
        this.search = typeof input.search === "string" ? input.search : undefined;
        this.dateFrom =
            typeof input.dateFrom === "string" ? input.dateFrom : undefined;
        this.dateTo = typeof input.dateTo === "string" ? input.dateTo : undefined;
    }
    getUserId() {
        return this.userId;
    }
    getPurpose() {
        return this.purpose ? FilePurpose_1.FilePurpose.create(this.purpose) : undefined;
    }
    getPage() {
        return this.page;
    }
    getPageSize() {
        return this.pageSize;
    }
    getSearch() {
        return this.search;
    }
    getDateFrom() {
        return this.dateFrom ? new Date(this.dateFrom) : undefined;
    }
    getDateTo() {
        return this.dateTo ? new Date(this.dateTo) : undefined;
    }
    validate() {
        const errors = [];
        if (this.purpose) {
            try {
                FilePurpose_1.FilePurpose.create(this.purpose);
            }
            catch (error) {
                errors.push(error.message);
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
exports.FileListRequestDto = FileListRequestDto;
//# sourceMappingURL=FileListRequestDto.js.map