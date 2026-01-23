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

// Heatmap intensity colors (Red theme)
export const HEATMAP_COLORS = {
  empty: '#1A1A1A',
  level0: '#1A1A1A',
  level1: '#5C1A1A',
  level2: '#8B2525',
  level3: '#C53030',
  level4: '#F56565',
};

// Light mode heatmap colors (Red theme)
export const HEATMAP_COLORS_LIGHT = {
  empty: '#EBEDF0',
  level0: '#EBEDF0',
  level1: '#FEB2B2',
  level2: '#FC8181',
  level3: '#F56565',
  level4: '#C53030',
};
