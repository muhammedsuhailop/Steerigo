import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
export declare class DatabaseErrorClassifier implements IErrorClassifier {
    readonly priority = 3;
    private readonly DATABASE_PATTERNS;
    canHandle(error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
    private isMongoDbDuplicateKeyError;
    private handleDuplicateKeyError;
    private getStringProp;
    private getNumberProp;
}
//# sourceMappingURL=DatabaseErrorClassifier.d.ts.map