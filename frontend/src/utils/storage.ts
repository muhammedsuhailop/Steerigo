import { AUTH_STORAGE_KEYS } from '@/constants';
import type { User } from '@/types';

export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const clearStoredUser = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Failed to clear user:', error);
  }
};
