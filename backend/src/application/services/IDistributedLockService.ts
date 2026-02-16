export interface IDistributedLockService {
  acquireLock(key: string, ttlSeconds: number): Promise<string | null>;
  releaseLock(key: string, token: string): Promise<boolean>;
  extendLock(key: string, token: string, ttlSeconds: number): Promise<boolean>;
}
