/**
 * Stats Utilities
 * 
 * Calculate streaks, completion rates, and other statistics
 */

import { Task, TaskStats } from '@/types/task';
import { formatDate, getToday, parseDate } from './date';

/**
 * Calculate all stats for a task
 */
export function calculateStats(task: Task): TaskStats {
  const completedDates = [...task.completedDates].sort();
  const today = getToday();
  const todayDate = new Date();
  
  // Current streak
  const currentStreak = calculateCurrentStreak(completedDates, today);
  
  // Longest streak
  const longestStreak = calculateLongestStreak(completedDates);
  
  // Total completions
  const totalCompletions = completedDates.length;
  
  // Monthly completions (current month)
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();
  const monthlyCompletions = completedDates.filter((date) => {
    const d = parseDate(date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
  
  // Yearly completions (current year)
  const yearlyCompletions = completedDates.filter((date) => {
    const d = parseDate(date);
    return d.getFullYear() === currentYear;
  }).length;
  
  // Completion rate (based on days since task creation)
  const createdDate = new Date(task.createdAt);
  const daysSinceCreation = Math.floor(
    (todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const completionRate = daysSinceCreation > 0 
    ? Math.round((totalCompletions / daysSinceCreation) * 100) 
    : 0;
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
    monthlyCompletions,
    yearlyCompletions,
  };
}

/**
 * Calculate current streak (consecutive days ending today or yesterday)
 */
function calculateCurrentStreak(sortedDates: string[], today: string): number {
  if (sortedDates.length === 0) return 0;
  
  // Check if today or yesterday is completed
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  const hasRecentCompletion = sortedDates.includes(today) || sortedDates.includes(yesterday);
  
  if (!hasRecentCompletion) return 0;
  
  let streak = 0;
  let currentDate = sortedDates.includes(today) ? today : yesterday;
  
  while (sortedDates.includes(currentDate)) {
    streak++;
    const prevDate = new Date(parseDate(currentDate));
    prevDate.setDate(prevDate.getDate() - 1);
    currentDate = formatDate(prevDate);
  }
  
  return streak;
}

/**
 * Calculate longest streak ever
 */
function calculateLongestStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = parseDate(sortedDates[i - 1]);
    const currDate = parseDate(sortedDates[i]);
    
    // Check if consecutive days
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}

/**
 * Calculate heatmap intensity level (0-4)
 * Based on streak leading up to that day
 */
export function calculateIntensity(
  date: string,
  completedDates: string[]
): number {
  if (!completedDates.includes(date)) return 0;
  
  // Calculate streak ending on this date
  const sortedDates = [...completedDates].sort();
  let streak = 1;
  let currentDate = date;
  
  while (true) {
    const prevDate = new Date(parseDate(currentDate));
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = formatDate(prevDate);
    
    if (sortedDates.includes(prevDateStr)) {
      streak++;
      currentDate = prevDateStr;
    } else {
      break;
    }
  }
  
  // Map streak to intensity (1-4)
  if (streak >= 30) return 4;
  if (streak >= 14) return 3;
  if (streak >= 7) return 2;
  return 1;
}

/**
 * Get completion status for a range of dates
 */
export function getCompletionMap(
  dates: string[],
  completedDates: string[]
): Map<string, { completed: boolean; intensity: number }> {
  const map = new Map();
  const completedSet = new Set(completedDates);
  
  dates.forEach((date) => {
    const completed = completedSet.has(date);
    const intensity = completed ? calculateIntensity(date, completedDates) : 0;
    map.set(date, { completed, intensity });
  });
  
  return map;
}
