export interface IIdGenerator {
  generate(prefix?: string): string;
}
