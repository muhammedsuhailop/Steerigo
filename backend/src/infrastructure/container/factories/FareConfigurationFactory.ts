import { FareConfigurationRepository } from "@application/repositories/FareConfigurationRepository";
import { FareCalculationService } from "@application/services/FareCalculationService";
import { FareConfigurationRepositoryImpl } from "@infrastructure/database/repositories/FareConfigurationRepositoryImpl";
import { TYPES } from "@shared/constants/DITypes";
import { Container } from "inversify";

export class FareCalculationFactory {
  static register(container: Container): void {
    container
      .bind<FareConfigurationRepository>(TYPES.FareConfigurationRepository)
      .to(FareConfigurationRepositoryImpl)
      .inSingletonScope();

    container
      .bind<FareCalculationService>(TYPES.FareCalculationService)
      .to(FareCalculationService)
      .inSingletonScope();
  }
}
