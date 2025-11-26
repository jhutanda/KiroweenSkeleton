// Shared storage utility for cross-app data synchronization
import { Note, Task } from '@shared/types';

const STORAGE_KEYS = {
  NOTES: 'kiroween_notes',
  TASKS: 'kiroween_tasks',
};

// Notes Storage
export const getNotesFromStorage = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notes from storage:', error);
    return [];
  }
};

export const saveNotesToStorage = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
  }
};

// Tasks Storage
export const getTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading tasks from storage:', error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

// Initialize with empty data
export const initializeStorage = (): void => {
  // Initialize empty storage if not exists
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
    saveNotesToStorage([]);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveTasksToStorage([]);
  }
};