/**
 * Task Context
 * 
 * Global state management for tasks using React Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/task';
import { TASK_COLORS } from '@/types/task';
import { StorageService } from '@/utils/storage';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (name: string) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleCompletion: (taskId: string, date: string) => Promise<void>;
  getTask: (taskId: string) => Task | undefined;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const storedTasks = await StorageService.getTasks();
    setTasks(storedTasks);
    setLoading(false);
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  const addTask = async (name: string): Promise<Task> => {
    const colorIndex = tasks.length % TASK_COLORS.length;
    const newTask: Task = {
      id: uuidv4(),
      name: name.trim(),
      color: TASK_COLORS[colorIndex],
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    
    await StorageService.addTask(newTask);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (updatedTask: Task) => {
    await StorageService.updateTask(updatedTask);
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const deleteTask = async (taskId: string) => {
    await StorageService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const toggleCompletion = async (taskId: string, date: string) => {
    const updatedTask = await StorageService.toggleCompletion(taskId, date);
    if (updatedTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    }
  };

  const getTask = useCallback(
    (taskId: string) => tasks.find((t) => t.id === taskId),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleCompletion,
        getTask,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
