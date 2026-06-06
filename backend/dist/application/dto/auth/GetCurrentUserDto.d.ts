export declare class GetCurrentUserDto {
    private userId;
    constructor(data: {
        userId: string;
    });
    static fromRequest(data: {
        userId: string;
    }): GetCurrentUserDto;
    getUserId(): string;
}
//# sourceMappingURL=GetCurrentUserDto.d.ts.map