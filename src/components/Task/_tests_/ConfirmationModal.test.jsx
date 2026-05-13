import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();
  const message = 'Are you sure you want to delete this task?';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with the correct message and buttons', () => {
    render(
      <ConfirmationModal
        message={message}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(message)).toBeTruthy();
    expect(screen.getByRole('button', { name: /yes/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /no/i })).toBeTruthy();
  });

  it('calls onConfirm when the "Yes" button is clicked', () => {
    render(
      <ConfirmationModal
        message={message}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Yes'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the "No" button is clicked', () => {
    render(
      <ConfirmationModal
        message={message}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('No'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking on the overlay', () => {
    const { container } = render(
      <ConfirmationModal
        message={message}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const overlay = container.querySelector('.confirmationModalOverlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when clicking inside the modal content', () => {
    render(
      <ConfirmationModal
        message={message}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const modalDialog = screen.getByRole('dialog');
    fireEvent.click(modalDialog);

    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});