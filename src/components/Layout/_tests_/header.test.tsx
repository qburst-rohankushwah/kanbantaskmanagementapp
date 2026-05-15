import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../index';

// Mock the MenuItems constant to ensure consistent test results
vi.mock('../constant', () => ({
  MenuItems: [
    { name: 'Board', href: '#board' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Reports', href: '#reports' },
  ],
}));

// Mock ThemeToggle as it might depend on context/store not present here
vi.mock('../../ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

describe('Header Component', () => {
  it('renders correctly with logo and navigation links', () => {
    render(<Header />);

    // Check for logo and brand name
    expect(screen.getByText('T')).toBeTruthy();
    expect(screen.getByText('TeamFlow')).toBeTruthy();

    // Check for navigation links
    expect(screen.getByText('Board')).toBeTruthy();
    expect(screen.getByText('Timeline')).toBeTruthy();
    expect(screen.getByText('Reports')).toBeTruthy();
  });

  it('updates the selected menu item when clicked', () => {
    render(<Header />);

    const boardLink = screen.getByText('Board');
    const timelineLink = screen.getByText('Timeline');

    // Initially 'Board' should be selected as per component default state
    expect(boardLink.className).toContain('selectedMenu');
    expect(timelineLink.className).toContain('nonSelectedMenu');

    // Simulate clicking on another menu item
    fireEvent.click(timelineLink);

    // Verify the selection classes have updated correctly
    expect(timelineLink.className).toContain('selectedMenu');
    expect(boardLink.className).toContain('nonSelectedMenu');
  });

  it('renders theme toggle and profile button', () => {
    render(<Header />);
    
    expect(screen.getByTestId('theme-toggle')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
