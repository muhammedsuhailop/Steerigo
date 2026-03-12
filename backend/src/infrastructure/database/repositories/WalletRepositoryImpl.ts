import { injectable } from "inversify";
import { Wallet } from "@domain/entities/Wallet";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { WalletModel } from "../models/WalletModel";
import { WalletMapper } from "../mappers/WalletMapper";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class WalletRepositoryImpl implements IWalletRepository {
  async save(wallet: Wallet): Promise<Wallet> {
    try {
      const persistence = WalletMapper.toPersistence(wallet);

      const doc = await WalletModel.findOneAndUpdate(
        { walletId: wallet.getId() },
        persistence,
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      ).exec();

      if (!doc) {
        throw new Error("Failed to save wallet");
      }

      Logger.info("Wallet saved", {
        walletId: doc.walletId,
        ownerId: doc.ownerId,
      });

      return WalletMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving wallet", {
        walletId: wallet.getId(),
        error,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Wallet | null> {
    try {
      const doc = await WalletModel.findOne({ walletId: id }).exec();

      return doc ? WalletMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding wallet", { id, error });
      throw error;
    }
  }

  async findByOwner(
    ownerId: string,
    ownerType: WalletOwnerType,
  ): Promise<Wallet | null> {
    try {
      const doc = await WalletModel.findOne({
        ownerId,
        ownerType,
      }).exec();

      return doc ? WalletMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding wallet by owner", {
        ownerId,
        ownerType,
        error,
      });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await WalletModel.countDocuments({
        walletId: id,
      }).exec();

      return count > 0;
    } catch (error) {
      Logger.error("Error checking wallet existence", { id, error });
      throw error;
    }
  }
}
