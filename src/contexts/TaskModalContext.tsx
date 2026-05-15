import React, { createContext, useContext, useState } from 'react';

interface Task {
  id?: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  column: string;
  priority: string;
  createdAt?: number;
}

interface TaskModalContextType {
  isOpen: boolean;
  task: Task | null;
  openModal: (task?: Task) => void;
  closeModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export const useTaskModal = () => {
  const context = useContext(TaskModalContext);
  if (context === undefined) {
    throw new Error('useTaskModal must be used within a TaskModalProvider');
  }
  return context;
};

interface TaskModalProviderProps {
  children: React.ReactNode;
}

export const TaskModalProvider: React.FC<TaskModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);

  const openModal = (taskToEdit?: Task ) => {
    setTask(taskToEdit || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTask(null);
  };

  const value = {
    isOpen,
    task,
    openModal,
    closeModal,
  };

  return (
    <TaskModalContext.Provider value={value}>
      {children}
    </TaskModalContext.Provider>
  );
};