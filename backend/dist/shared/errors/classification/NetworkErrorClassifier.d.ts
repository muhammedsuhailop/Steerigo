import { IErrorClassifier } from "./IErrorClassifier";
import { ErrorDetails } from "../ErrorDetails";
export declare class NetworkErrorClassifier implements IErrorClassifier {
    readonly priority = 4;
    private readonly NETWORK_PATTERNS;
    canHandle(error: unknown): boolean;
    classify(error: unknown): ErrorDetails;
    private getStringProp;
}
//# sourceMappingURL=NetworkErrorClassifier.d.ts.map