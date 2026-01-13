import type { User } from "@/types/User";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

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

export function formatDateRange(dateRange: { from?: Date; to?: Date }): string {
  const { from, to } = dateRange;

  if (!from) return 'Pilih Tanggal';

  if (!to) return format(from, 'dd MMM yyyy');

  const fromDateStr = format(from, 'yyyy-MM-dd');
  const toDateStr = format(to, 'yyyy-MM-dd');

  if (fromDateStr === toDateStr) {
    return format(from, 'dd MMM yyyy');
  }

  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${daysDiff} hari`;
}