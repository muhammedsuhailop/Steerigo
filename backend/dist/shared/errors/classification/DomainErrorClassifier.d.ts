import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
export declare class DomainErrorClassifier implements IErrorClassifier {
    readonly priority = 1;
    canHandle(error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
}
//# sourceMappingURL=DomainErrorClassifier.d.ts.map