import { AdminUserAction } from "@domain/value-objects/AdminAction";
export declare class UpdateUserStatusRequestDto {
    private readonly data;
    constructor(requestData: unknown);
    static fromRequest(userId: string, requestBody: unknown): UpdateUserStatusRequestDto;
    getUserId(): string;
    getAction(): AdminUserAction;
    getReason(): string | undefined;
}
//# sourceMappingURL=UpdateUserStatusRequestDto.d.ts.map