import { readStorage, writeStorage } from "../hooks/useLocalStorage";


export const isOverDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

export const isDueToday = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return (
    due.getDate() === today.getDate() &&
    due.getMonth() === today.getMonth() &&
    due.getFullYear() === today.getFullYear()
  );
};

/**
 * Fetches all unique assignee names from a list of tasks.
 * @param {Array<Object>} tasks An array of task objects.
 * @returns {Array<string>} An array of unique assignee names.
 */
export const fetchAssignee = (tasks) => {
  const assigneeNames = new Set();
  tasks.forEach((task) => {
    if (task.assignee) {
      assigneeNames.add(task.assignee);
    }
  });

  return Array.from(assigneeNames);
};

export const logActivity = (action) => {
  const history = readStorage("history", []);
  const newEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString(),
    ...action,
  };
  writeStorage("history", [newEntry, ...history]);
};