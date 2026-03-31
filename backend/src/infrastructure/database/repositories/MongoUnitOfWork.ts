import { ClientSession, connection } from "mongoose";
import { IUnitOfWork } from "@domain/repositories/IUnitOfWork";
import { injectable } from "inversify";

@injectable()
export class MongoUnitOfWork implements IUnitOfWork {
  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    const session: ClientSession = await connection.startSession();

    try {
      session.startTransaction();

      const result = await work();

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
