import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPeriod(period: string) {
  if (!period) return period
  const [start, end] = period.split(' - ')
  if (!start || !end) return period

  const formatDate = (dateStr: string) => {
    if (!dateStr.includes('-')) return dateStr
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return `${formatDate(start)} - ${formatDate(end)}`
}
