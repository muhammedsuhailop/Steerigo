import { FareConfiguration } from "@domain/entities/FareConfiguration";

export interface FareConfigurationRepository {
  findById(id: string): Promise<FareConfiguration | null>;
  findActiveConfiguration(date?: Date): Promise<FareConfiguration | null>;
  save(configuration: FareConfiguration): Promise<FareConfiguration>;
  findAll(): Promise<FareConfiguration[]>;
}
