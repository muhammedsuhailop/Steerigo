import { AccountStatusError } from "../AccountStatusError";
import { AccountStatusMessageStrategy } from "../strategies/AccountStatusMessageStrategy";
export declare class AccountStatusErrorFactory {
    private static strategies;
    static createError(status: string): AccountStatusError;
    static registerStrategy(status: string, strategy: AccountStatusMessageStrategy): void;
}
//# sourceMappingURL=AccountStatusErrorFactory.d.ts.map