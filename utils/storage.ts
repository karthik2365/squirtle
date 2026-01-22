/**
 * Storage Utilities
 * 
 * Offline-first local storage using AsyncStorage
 * Scalable for future cloud sync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const TASKS_KEY = '@streakly_tasks';

export const StorageService = {
  /**
   * Get all tasks from local storage
   */
  async getTasks(): Promise<Task[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading tasks:', e);
      return [];
    }
  },

  /**
   * Save all tasks to local storage
   */
  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(TASKS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  },

  /**
   * Add a new task
   */
  async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
  },

  /**
   * Update an existing task
   */
  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      await this.saveTasks(tasks);
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    await this.saveTasks(filtered);
  },

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find((t) => t.id === taskId) || null;
  },

  /**
   * Toggle completion for a specific date
   */
  async toggleCompletion(taskId: string, date: string): Promise<Task | null> {
    const tasks = await this.getTasks();
    const task = tasks.find((t) => t.id === taskId);
    
    if (!task) return null;

    const dateIndex = task.completedDates.indexOf(date);
    if (dateIndex === -1) {
      // Add completion
      task.completedDates.push(date);
    } else {
      // Remove completion
      task.completedDates.splice(dateIndex, 1);
    }

    await this.saveTasks(tasks);
    return task;
  },

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_KEY);
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  },
};
