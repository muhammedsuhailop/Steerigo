export class RefreshTokenDto {
    public readonly refreshToken: string;
    constructor(data: { refreshToken: string }) {
        this.refreshToken = data.refreshToken;
    }
}