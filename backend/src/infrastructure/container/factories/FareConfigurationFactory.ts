import { IFareConfigurationRepository } from "@domain/repositories/IFareConfigurationRepository";
import { IFareCalculationService } from "@application/services/IFareCalculationService";
import { FareConfigurationRepositoryImpl } from "@infrastructure/database/repositories/FareConfigurationRepositoryImpl";
import { TYPES } from "@shared/constants/DITypes";
import { Container } from "inversify";

export class FareCalculationFactory {
  static register(container: Container): void {
    container
      .bind<IFareConfigurationRepository>(TYPES.FareConfigurationRepository)
      .to(FareConfigurationRepositoryImpl)
      .inSingletonScope();

    container
      .bind<IFareCalculationService>(TYPES.FareCalculationService)
      .to(IFareCalculationService)
      .inSingletonScope();
  }
}
