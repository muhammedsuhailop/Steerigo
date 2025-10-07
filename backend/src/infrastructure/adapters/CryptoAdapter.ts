export interface CryptoAdapter {
  hash(data: string, saltRounds: number): Promise<string>;
  compare(data: string, hashedData: string): Promise<boolean>;
}

export class BcryptAdapter implements CryptoAdapter {
  private bcrypt: any;

  constructor() {
    this.bcrypt = require("bcrypt");
  }

  async hash(data: string, saltRounds: number): Promise<string> {
    return this.bcrypt.hash(data, saltRounds);
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    return this.bcrypt.compare(data, hashedData);
  }
}
