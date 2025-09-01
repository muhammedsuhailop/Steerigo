import type { User } from '../entities/User.ts';


export interface IUserRepo {
create(user: Partial<User>): Promise<User>;
findByEmail(email: string): Promise<User | null>;
findByMobile(mobile: string): Promise<User | null>;
updateByEmail(email: string, update: Partial<User & { otpHash?: string; otpExpires?: Date | null; otpAttempts?: number }>): Promise<User | null>;
}