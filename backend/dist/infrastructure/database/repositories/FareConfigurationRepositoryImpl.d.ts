import { IFareConfigurationRepository } from "../../../domain/repositories/IFareConfigurationRepository";
import { FareConfiguration } from "../../../domain/entities/FareConfiguration";
export declare class FareConfigurationRepositoryImpl implements IFareConfigurationRepository {
    findById(id: string): Promise<FareConfiguration | null>;
    findActiveConfiguration(date?: Date): Promise<FareConfiguration | null>;
    save(configuration: FareConfiguration): Promise<FareConfiguration>;
    findAll(): Promise<FareConfiguration[]>;
    exists(id: string): Promise<boolean>;
    delete(id: string): Promise<void>;
    deactivateConfiguration(id: string): Promise<void>;
    findHistoricalConfigurations(): Promise<FareConfiguration[]>;
}
//# sourceMappingURL=FareConfigurationRepositoryImpl.d.ts.map