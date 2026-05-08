import { injectable } from "inversify";
import { customAlphabet } from "nanoid";
import { IIdGenerator } from "@application/services/IIdGenerator";

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 16);

@injectable()
export class NanoIdGenerator implements IIdGenerator {
  generate(prefix?: string): string {
    const id = nanoid();

    return prefix ? `${prefix}-${id}` : id;
  }
}
