import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
export declare class ValidationErrorClassifier implements IErrorClassifier {
    readonly priority = 2;
    canHandle(error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
    private getStringProp;
}
//# sourceMappingURL=ValidationErrorClassifier.d.ts.map