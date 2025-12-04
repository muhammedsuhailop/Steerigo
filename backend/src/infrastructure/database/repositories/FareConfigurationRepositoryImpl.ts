import { injectable } from "inversify";
import { IFareConfigurationRepository } from "@application/repositories/IFareConfigurationRepository";
import { FareConfiguration } from "@domain/entities/FareConfiguration";
import {
  FareConfigurationModel,
  IFareConfigurationDocument,
} from "../models/FareConfigurationModel";
import { FareConfigurationMapper } from "../mappers/FareConfigurationMapper";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class FareConfigurationRepositoryImpl
  implements IFareConfigurationRepository
{
  async findById(id: string): Promise<FareConfiguration | null> {
    try {
      const doc = await FareConfigurationModel.findById(id);
      return doc ? FareConfigurationMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding fare configuration by id", { id, error });
      throw error;
    }
  }

  async findActiveConfiguration(
    date: Date = new Date()
  ): Promise<FareConfiguration | null> {
    try {
      const doc = await FareConfigurationModel.findOne({
        isActive: true,
        effectiveFrom: { $lte: date },
        $or: [{ effectiveTill: null }, { effectiveTill: { $gte: date } }],
      }).sort({ effectiveFrom: -1 });

      return doc ? FareConfigurationMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active fare configuration", { date, error });
      throw error;
    }
  }

  async save(configuration: FareConfiguration): Promise<FareConfiguration> {
    try {
      const configId = configuration.getId();
      const configData = FareConfigurationMapper.toPersistence(configuration);

      const savedDoc = await FareConfigurationModel.findByIdAndUpdate(
        configId,
        configData,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      if (!savedDoc) {
        throw new Error(`Failed to save fare configuration: ${configId}`);
      }

      Logger.info("Fare configuration saved successfully", {
        configId,
        baseAmount: configuration.getBaseAmount(),
      });

      return FareConfigurationMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving fare configuration", {
        configId: configuration.getId(),
        error,
      });
      throw error;
    }
  }

  async findAll(): Promise<FareConfiguration[]> {
    try {
      const docs = await FareConfigurationModel.find().sort({
        effectiveFrom: -1,
      });

      return docs.map(FareConfigurationMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding all fare configurations", { error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await FareConfigurationModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking fare configuration existence", {
        id,
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await FareConfigurationModel.findByIdAndDelete(id);
      Logger.info("Fare configuration deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting fare configuration", { id, error });
      throw error;
    }
  }

  async deactivateConfiguration(id: string): Promise<void> {
    try {
      await FareConfigurationModel.findByIdAndUpdate(id, {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      });

      Logger.info("Fare configuration deactivated", { id });
    } catch (error) {
      Logger.error("Error deactivating fare configuration", { id, error });
      throw error;
    }
  }

  async findHistoricalConfigurations(): Promise<FareConfiguration[]> {
    try {
      const docs = await FareConfigurationModel.find({
        isActive: false,
      }).sort({ effectiveFrom: -1 });

      return docs.map(FareConfigurationMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding historical fare configurations", { error });
      throw error;
    }
  }
}
