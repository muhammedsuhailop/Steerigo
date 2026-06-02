import { FareConfiguration } from "../../../domain/entities/FareConfiguration";
import { IFareConfigurationDocument } from "../models/FareConfigurationModel";
export declare class FareConfigurationMapper {
    static toDomain(doc: IFareConfigurationDocument): FareConfiguration;
    static toPersistence(config: FareConfiguration): Partial<IFareConfigurationDocument>;
}
//# sourceMappingURL=FareConfigurationMapper.d.ts.map