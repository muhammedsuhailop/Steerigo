export interface CryptoAdapter {
    hash(data: string, saltRounds: number): Promise<string>;
    compare(data: string, hashedData: string): Promise<boolean>;
}
export declare class BcryptAdapter implements CryptoAdapter {
    hash(data: string, saltRounds: number): Promise<string>;
    compare(data: string, hashedData: string): Promise<boolean>;
}
//# sourceMappingURL=CryptoAdapter.d.ts.map