//cn helper for each component to use
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Joins class names and resolves Tailwind conflicts, for example cn('px-2', 'px-4') gives 'px-4'.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}