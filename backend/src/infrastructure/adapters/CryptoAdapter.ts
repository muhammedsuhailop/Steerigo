import bcrypt from "bcrypt";

export interface CryptoAdapter {
  hash(data: string, saltRounds: number): Promise<string>;
  compare(data: string, hashedData: string): Promise<boolean>;
}

export class BcryptAdapter implements CryptoAdapter {
  async hash(data: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(data, saltRounds);
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}
