import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckBox } from '../CheckBox';

describe('CheckBox Component', () => {
  it('renders correctly with the provided checked state', () => {
    const { rerender } = render(<CheckBox checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    rerender(<CheckBox checked={true} onChange={() => {}} />);
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const mockOnChange = vi.fn();
    render(<CheckBox checked={false} onChange={mockOnChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('applies standard and conditional classes correctly', () => {
    const customClass = 'test-class';
    
    // Test when unchecked - should only have base class
    const { rerender } = render(
      <CheckBox checked={false} onChange={() => {}} className={customClass} />
    );
    let checkbox = screen.getByRole('checkbox');
    
    expect(checkbox.className).toContain('custom-checkbox');
    expect(checkbox.className).not.toContain(customClass);

    // Test when checked - should have both base and custom class
    rerender(
      <CheckBox checked={true} onChange={() => {}} className={customClass} />
    );
    expect(checkbox.className).toContain('custom-checkbox');
    expect(checkbox.className).toContain(customClass);
  });

  it('has the correct input type', () => {
    render(<CheckBox checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
  });
});