import type { User } from "@/types/User";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const newObj = { ...obj };
  for (const key of keys) {
    delete newObj[key];
  }
  return newObj;
}

export function hasRole(user: User, roles: string[]) {
  return user && roles.includes(user.role);
}

export function formatRupiah(amount: number): string {
  return `${amount.toLocaleString('id-ID')}`;
}