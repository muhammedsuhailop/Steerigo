export declare class Password {
    private readonly hashedValue;
    private constructor();
    static createFromPlainText(plainText: string): Password;
    static createFromHash(hashedValue: string): Password;
    static createEmpty(): Password;
    private static isStrongPassword;
    getHashedValue(): string;
    isHashed(): boolean;
}
//# sourceMappingURL=Password.d.ts.map