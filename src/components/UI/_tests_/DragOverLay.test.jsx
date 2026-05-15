import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DragOverLay from '../DragOverLay';

describe('DragOverLay Component', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Review PR',
    priority: 'high',
    dueDate: '2023-11-20',
    assignee: 'John Doe'
  };

  it('renders basic task details correctly', () => {
    render(<DragOverLay task={mockTask} />);

    expect(screen.getByText('Review PR')).toBeTruthy();
    expect(screen.getByText('HIGH')).toBeTruthy();
    expect(screen.getByText('2023-11-20')).toBeTruthy();
  });

  it('displays the correct assignee initials', () => {
    render(<DragOverLay task={mockTask} />);
    
    // "John Doe" -> "JD"
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('displays "?" when the assignee is missing', () => {
    const taskWithoutAssignee = { ...mockTask, assignee: '' };
    render(<DragOverLay task={taskWithoutAssignee} />);
    
    expect(screen.getByText('?')).toBeTruthy();
  });

  it('applies the correct priority class to the dot', () => {
    render(<DragOverLay task={mockTask} />);
    
    const dot = screen.getByTestId('priority-dot');
    expect(dot.className).toContain('high');
  });

  it('renders correctly with an empty task object', () => {
    // Testing safety against null/undefined tasks or empty properties
    render(<DragOverLay task={{}} />);
    
    expect(screen.getByText('?')).toBeTruthy();
    const dot = screen.getByTestId('priority-dot');
    expect(dot.className).toContain('undefined');
  });
});