/**
 * Date Utilities
 * 
 * Helper functions for date manipulation and formatting
 */

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get an array of dates for the past N days
 */
export function getPastDays(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates;
}

/**
 * Get all dates in a year (for yearly heatmap)
 */
export function getYearDates(year: number): string[] {
  const dates: string[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Get the week number of a date
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get the day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  return parseDate(dateString).getDay();
}

/**
 * Get month name from date string
 */
export function getMonthName(dateString: string, short: boolean = false): string {
  const date = parseDate(dateString);
  return date.toLocaleString('default', { month: short ? 'short' : 'long' });
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getToday();
}

/**
 * Check if a date is in the future
 */
export function isFuture(dateString: string): boolean {
  return dateString > getToday();
}

/**
 * Get relative date label
 */
export function getRelativeLabel(dateString: string): string {
  const today = getToday();
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  
  if (dateString === today) return 'Today';
  if (dateString === yesterday) return 'Yesterday';
  
  const date = parseDate(dateString);
  return date.toLocaleDateString('default', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Get dates for current month grid (including padding days)
 */
export function getMonthGrid(year: number, month: number): (string | null)[] {
  const grid: (string | null)[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding for days before the 1st
  const startPadding = firstDay.getDay();
  for (let i = 0; i < startPadding; i++) {
    grid.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    grid.push(formatDate(new Date(year, month, day)));
  }
  
  return grid;
}

/**
 * Get dates for the past 365 days organized by weeks (for GitHub-style heatmap)
 */
export function getYearHeatmapData(): { weeks: string[][]; months: { name: string; startWeek: number }[] } {
  const weeks: string[][] = [];
  const months: { name: string; startWeek: number }[] = [];
  const today = new Date();
  
  // Start from 364 days ago to get exactly 52 weeks + partial week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  
  // Adjust to start from Sunday
  const startDayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDayOfWeek);
  
  let currentWeek: string[] = [];
  let currentMonth = -1;
  let weekIndex = 0;
  
  const current = new Date(startDate);
  while (current <= today) {
    const dateStr = formatDate(current);
    
    // Track month changes for labels
    if (current.getMonth() !== currentMonth) {
      currentMonth = current.getMonth();
      months.push({
        name: current.toLocaleString('default', { month: 'short' }),
        startWeek: weekIndex,
      });
    }
    
    currentWeek.push(dateStr);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
      weekIndex++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  // Push any remaining days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return { weeks, months };
}
