import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddTaskButton from '../AddTaskButton';

// Mock the AddIcon to isolate the button testing
vi.mock('../../../assets/Icons/Add', () => ({
  AddIcon: () => <span data-testid="add-icon">Icon</span>,
}));

describe('AddTaskButton Component', () => {
  it('renders correctly with default primary variant', () => {
    render(<AddTaskButton onClick={() => {}} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    
    expect(button).toBeTruthy();
    expect(button.className).toContain('btn-primary');
    expect(button.className).toContain('addItemButton');
    expect(screen.getByTestId('add-icon')).toBeTruthy();
  });

  it('renders with the secondary variant class when specified', () => {
    render(<AddTaskButton onClick={() => {}} variant="secondary" />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    
    expect(button.className).toContain('btn-secondary');
    expect(button.className).not.toContain('btn-primary');
  });

  it('triggers the onClick callback when clicked', () => {
    const mockOnClick = vi.fn();
    render(<AddTaskButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});