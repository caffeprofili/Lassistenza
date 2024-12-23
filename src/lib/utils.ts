import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function price(n?: number | string): string {
  const num = typeof n === 'string' ? parseFloat(n) : n
  const formatter = new Intl.NumberFormat('it', {
    style: 'currency',
    currency: 'EUR',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })
  return formatter.format(num ?? 0)
}
