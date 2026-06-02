"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareCalculationFactory = void 0;
const IFareCalculationService1_1 = require("../../../application/services/IFareCalculationService1");
const FareConfigurationRepositoryImpl_1 = require("../../database/repositories/FareConfigurationRepositoryImpl");
const DITypes_1 = require("../../../shared/constants/DITypes");
class FareCalculationFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.FareConfigurationRepository)
            .to(FareConfigurationRepositoryImpl_1.FareConfigurationRepositoryImpl)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.FareCalculationService)
            .to(IFareCalculationService1_1.IFareCalculationService)
            .inSingletonScope();
    }
}
exports.FareCalculationFactory = FareCalculationFactory;
//# sourceMappingURL=FareConfigurationFactory.js.map