import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
export declare class UnknownErrorClassifier implements IErrorClassifier {
    readonly priority = 99;
    canHandle(_error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
}
//# sourceMappingURL=UnknownErrorClassifier.d.ts.map