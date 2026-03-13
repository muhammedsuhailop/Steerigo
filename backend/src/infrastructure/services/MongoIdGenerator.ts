import { IIdGenerator } from "@application/services/IIdGenerator";
import { Types } from "mongoose";

export class MongoIdGenerator implements IIdGenerator {
  generate(): string {
    return new Types.ObjectId().toString();
  }
}
