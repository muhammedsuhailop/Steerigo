import { ErrorDetails } from "../ErrorDetails";
export interface IErrorClassifier {
    canHandle(error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
    readonly priority: number;
}
//# sourceMappingURL=IErrorClassifier.d.ts.map