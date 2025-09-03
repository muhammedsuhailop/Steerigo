export class RefreshTokenDto {
    public readonly refreshToken: string;
    constructor(data: any) {
        this.refreshToken = data.refreshToken;
    }
}