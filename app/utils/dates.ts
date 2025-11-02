import { format, isSameYear, isToday } from 'date-fns'

export function formatDate(date: string | number | Date) {
  // if its today
  if (isToday(date)) {
    return format(date, 'HH:mm')
  }

  if (isSameYear(date, Date.now())) {
    return format(date, 'MMM dd')
  }

  return format(date, 'yyyy/MM/dd')
}
