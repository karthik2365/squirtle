/**
 * Task Data Models
 * 
 * Core data structures for the productivity calendar app
 */

export interface Task {
  id: string;
  name: string;
  color: string;
  createdAt: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface TaskStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // percentage
  monthlyCompletions: number;
  yearlyCompletions: number;
}

export interface DayCompletion {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  intensity: number; // 0-4 for heatmap (0 = not completed, 1-4 based on streak)
}

export interface HeatmapData {
  date: string;
  count: number;
  intensity: number; // 0-4 levels like GitHub
}

// Color palette for tasks
export const TASK_COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

// Heatmap intensity colors (GitHub-style green)
export const HEATMAP_COLORS = {
  empty: '#161B22',
  level0: '#161B22',
  level1: '#0E4429',
  level2: '#006D32',
  level3: '#26A641',
  level4: '#39D353',
};

// Light mode heatmap colors
export const HEATMAP_COLORS_LIGHT = {
  empty: '#EBEDF0',
  level0: '#EBEDF0',
  level1: '#9BE9A8',
  level2: '#40C463',
  level3: '#30A14E',
  level4: '#216E39',
};
