import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskCard from '../TaskCard';
import { useTaskModal } from '../../../contexts/TaskModalContext';
import { readStorage, writeStorage } from '../../../hooks/useLocalStorage';
import { isOverDue, logActivity } from '../../../utils/utils';

// Mock hooks and external dependencies
vi.mock('../../../contexts/TaskModalContext', () => ({
  useTaskModal: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

vi.mock('../../../hooks/useLocalStorage', () => ({
  readStorage: vi.fn(),
  writeStorage: vi.fn(),
}));

vi.mock('../../../utils/utils', () => ({
  isOverDue: vi.fn(),
  logActivity: vi.fn(),
}));

// Mock icons
vi.mock('../../../assets/Icons/Edit', () => ({
  EditIcon: () => <div data-testid="edit-icon">Edit</div>,
}));
vi.mock('../../../assets/Icons/Delete', () => ({
  DeleteIcon: () => <div data-testid="delete-icon">Delete</div>,
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: 'task-123',
    title: 'Write Documentation',
    priority: 'medium',
    dueDate: '2023-11-01',
    assignee: 'Jane Doe',
    column: 'todo',
  };

  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTaskModal.mockReturnValue({ openModal: mockOpenModal });
    isOverDue.mockReturnValue(false);
  });

  it('renders task content correctly', () => {
    render(<TaskCard data={mockTask} />);

    expect(screen.getByText('Write Documentation')).toBeTruthy();
    expect(screen.getByText('MEDIUM')).toBeTruthy();
    expect(screen.getByText(/2023-11-01/)).toBeTruthy();
    expect(screen.getByText('JD')).toBeTruthy(); // Initials of Jane Doe
  });

  it('shows overdue indicator when task is past its due date', () => {
    isOverDue.mockReturnValue(true);
    render(<TaskCard data={mockTask} />);
    expect(screen.getByText('Overdue')).toBeTruthy();
  });

  it('triggers openModal when the edit button is clicked', () => {
    render(<TaskCard data={mockTask} />);
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    expect(mockOpenModal).toHaveBeenCalledWith(mockTask);
  });

  it('opens the confirmation modal when the delete button is clicked', () => {
    render(<TaskCard data={mockTask} />);
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    expect(screen.getByText(/Are you sure you want to delete this task/i)).toBeTruthy();
  });

  it('executes deletion and logs activity when delete is confirmed', () => {
    const otherTask = { id: 'task-456' };
    const taskList = [mockTask, otherTask];
    readStorage.mockReturnValue(taskList);
    
    render(<TaskCard data={mockTask} />);
    
    // Open modal
    fireEvent.click(screen.getByLabelText('Delete task'));
    
    // Confirm
    fireEvent.click(screen.getByText('Yes'));

    expect(readStorage).toHaveBeenCalledWith('todo', []);
    expect(writeStorage).toHaveBeenCalledWith('todo', [otherTask]);
    expect(logActivity).toHaveBeenCalledWith({ type: 'DELETE', task: mockTask, from: 'todo' });
    expect(screen.queryByText(/Are you sure you want to delete this task/i)).toBeNull();
  });

  it('closes the modal and preserves the task when deletion is cancelled', () => {
    render(<TaskCard data={mockTask} />);
    
    fireEvent.click(screen.getByLabelText('Delete task'));
    fireEvent.click(screen.getByText('No'));

    expect(writeStorage).not.toHaveBeenCalled();
    expect(logActivity).not.toHaveBeenCalled();
    expect(screen.queryByText(/Are you sure you want to delete this task/i)).toBeNull();
  });
});