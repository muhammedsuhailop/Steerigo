import { v4 as uuidv4 } from "uuid";
import { IIdGenerator } from "@application/services/IIdGenerator";

export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}
