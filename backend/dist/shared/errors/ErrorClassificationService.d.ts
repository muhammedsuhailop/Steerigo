import { IErrorClassifier } from "./classification/IErrorClassifier";
import { ErrorDetails } from "./ErrorDetails";
export declare class ErrorClassificationService {
    private readonly classifiers;
    constructor();
    classify(error: unknown, context?: string): ErrorDetails;
    addClassifier(classifier: IErrorClassifier): void;
}
//# sourceMappingURL=ErrorClassificationService.d.ts.map