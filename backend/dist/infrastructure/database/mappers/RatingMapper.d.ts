import { Rating } from "@domain/entities/Rating";
import { IRatingDocument } from "../models/RatingModel";
export declare class RatingMapper {
    static toDomain(doc: IRatingDocument): Rating;
    static toPersistence(entity: Rating): Partial<IRatingDocument>;
}
//# sourceMappingURL=RatingMapper.d.ts.map